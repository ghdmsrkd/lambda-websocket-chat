import * as ddb from "./common/ddb"
import UserRepository from "./common/ddb/user/user.repo"
import * as AWS from "aws-sdk"
import { getResponse } from "./common/util/response";

const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'http://localhost:3001',
});

exports.websocketHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    const connection_id = event.requestContext.connectionId
    const { room_id, user_id } = event.queryStringParameters

    try {
        const userRepo = UserRepository.getInstance()
        if(event.requestContext.eventType === "CONNECT"){
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

exports.sendMessageHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)

    const requestBody = JSON.parse(event.body)
    console.log(JSON.stringify(requestBody.message))
    const dt = { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify(requestBody.message) };
    try {
        await apiGatewayManagementApi.postToConnection(dt).promise();
        return getResponse("success", "sendMessage")
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
    
}