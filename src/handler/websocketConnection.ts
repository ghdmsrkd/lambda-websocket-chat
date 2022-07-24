import UserRepository from "../common/ddb/user/user.repo"
import { getResponse } from "../common/util/response";
import { WebsocketClient } from "../common/webdocket";

export const websocketHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    const connection_id = event.requestContext.connectionId

    try {
        const userRepo = UserRepository.getInstance()
        const websocket = WebsocketClient.getInstance()

        if(event.requestContext.eventType === "CONNECT"){ // 연결 할때
            const { room_id, user_id } = event.queryStringParameters
            const joinedUserExceptMe = await userRepo.getUsersByRoomId(room_id)
            const user = await userRepo.createUser(connection_id, room_id, user_id)

            for(const joinedUser of joinedUserExceptMe){
                await websocket.joinedRoom(joinedUser.connection_id, user_id)
            }
            return getResponse("success", "connect")
        } else { // 연결 끊을 때
            const user = await userRepo.deleteUserById(connection_id)
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
