import * as ddb from "./common/ddb"
import UserRepository from "./common/ddb/user/user.repo"
import * as AWS from "aws-sdk"
import { getResponse } from "./common/util/response";
import RoomRepository from "./common/ddb/room/room.repo";

const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'http://localhost:3001',
});

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
        if(event.requestContext.eventType === "CONNECT"){
            const { room_id, user_id } = event.queryStringParameters
            const user = await userRepo.createUser(connection_id, room_id, user_id)
            console.log(user)
            return getResponse("success", "connect")
        } else {
            const user = await userRepo.deleteUserById(connection_id)
            console.log(user)
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

    const body: TSendMessageBody = JSON.parse(event.body)
    console.log(JSON.stringify(body.message))
    const dt = { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify(body.message) };
    try {
        await apiGatewayManagementApi.postToConnection(dt).promise();
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