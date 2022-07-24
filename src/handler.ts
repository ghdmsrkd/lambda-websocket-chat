import * as ddb from "./common/ddb"
import UserRepository from "./common/ddb/user/user.repo"
import { getResponse } from "./common/util/response";
import RoomRepository from "./common/ddb/room/room.repo";
import MessageRepository from "./common/ddb/message/message.repo";
import { WebsocketClient } from "./common/webdocket";

exports.websocketDefaultHandler = async (event: any, context: any, callback: any) => {
    console.log(event)
    return getResponse("success", "This is default route. You should set abled route")
}

exports.websocketHandler = async (event: any, context: any, callback: any) => {
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


type TSendMessageBody = {
    action: string
    room_id: string
    user_id: string
    message: string
}

exports.sendMessageHandler = async (event: any, context: any, callback: any) => {
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

exports.roomHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    const method = event.httpMethod
    const roomRepo = RoomRepository.getInstance()
    try {
        if(method === "GET") {
            const rooms = await roomRepo.getAllRooms()
            return getResponse("success", rooms)
        } else if(method === "POST") {
            const { room_name } = JSON.parse(event.body)
            const room = await roomRepo.createRoom(room_name)
            return getResponse("success", room)
        }
        
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
}