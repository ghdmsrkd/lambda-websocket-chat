import UserRepository from "../common/ddb/user/user.repo"
import { getResponse } from "../common/util/response";
import MessageRepository from "../common/ddb/message/message.repo";
import { WebsocketClient } from "../common/webdocket";

type TSendMessageBody = {
    action: string
    room_id: string
    user_id: string
    message: string
}

// websocket sendMessage에 해당하는 헨들러
export const sendMessageHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    try {
        const body: TSendMessageBody = JSON.parse(event.body)

        // 전달 받은 메시지를 저장한다.
        const messageRepo = MessageRepository.getInstance()
        await messageRepo.createMessage(body.room_id, body.user_id, body.message)
        
        // 체팅 방에 참여 하고 있는 유저의 정보를 가져온다.
        const userRepo = UserRepository.getInstance()
        const joinedUsers = await userRepo.getUsersByRoomId(body.room_id)
        const joinedConnectionIds = joinedUsers.map(user => {
            return user.connection_id
        })

        // 체팅방에 참여하고 있는 유저들에게 메시지를 전달 한다.
        const websocket = WebsocketClient.getInstance()
        for(const connectionId of joinedConnectionIds) {
            await websocket.sendMessage(connectionId, body)
        }
        return getResponse("success", "sendMessage")
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
}