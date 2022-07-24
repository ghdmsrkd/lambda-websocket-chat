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

export const sendMessageHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    try {
        const body: TSendMessageBody = JSON.parse(event.body)
        console.log(body)

        const messageRepo = MessageRepository.getInstance()
        await messageRepo.createMessage(body.user_id, body.user_id, body.message)
        
        const userRepo = UserRepository.getInstance()
        const joinedUsers = await userRepo.getUsersByRoomId(body.room_id)
        const joinedConnectionIds = joinedUsers.map(user => {
            return user.connection_id
        })

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