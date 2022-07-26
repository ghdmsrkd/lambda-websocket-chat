import UserRepository from "../common/ddb/user/user.repo"
import { getResponse } from "../common/util/response";
import { WebsocketClient } from "../common/webdocket";

// websocket $connet, $disconnect에 해당하는 헨들러
export const websocketHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    const connection_id = event.requestContext.connectionId

    try {
        const userRepo = UserRepository.getInstance()
        const websocket = WebsocketClient.getInstance()

        if(event.requestContext.eventType === "CONNECT"){ // $connect 일때
            const { room_id, user_id } = event.queryStringParameters
            // 먼저 체팅 방에 참여 하고 있는 유저의 정보를 가져온다.
            const joinedUserExceptMe = await userRepo.getUsersByRoomId(room_id)
            // 체팅 방에 참여한 유저를 저장한다.
            const user = await userRepo.createUser(connection_id, room_id, user_id)
            
            // 먼저 체팅 방에 참여 하고 있는 유저들에게 새로운 유저가 참가 했다고 메시지를 전달 한다.
            for(const joinedUser of joinedUserExceptMe){
                await websocket.joinedRoom(joinedUser.connection_id, user_id)
            }
            return getResponse("success", "connect")
        } else { // $disconnect 일때
            // 체팅 방을 떠난 유저를 삭제한다.
            const user = await userRepo.deleteUserById(connection_id)

            // 체팅방에 남아 있는 유저들에게 유저가 떠났다고 메시지를 전달한다.
            const remainUsers = await userRepo.getUsersByRoomId(user.room_id)
            for(const joinedUser of remainUsers){
                await websocket.leavedRoom(joinedUser.connection_id, user.user_id)
            }
            return getResponse("success", "disconnect")
        }
        
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
}
