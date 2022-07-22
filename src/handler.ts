import * as ddb from "./common/ddb"
import UserRepository from "./common/ddb/user/user.repo"
import * as AWS from "aws-sdk"

const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'http://localhost:3001',
});

exports.websocketHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)
    const { room_id, user_id } = event.queryStringParameters
    console.log(room_id, user_id)

    try {
        const userRepo = UserRepository.getInstance()
        if(event.requestContext.eventType === "CONNECT"){
            const user = await userRepo.createUserById(event.requestContext.connectionId)
            console.log(user)
            
        } else {
            const user = await userRepo.deleteUserById(event.requestContext.connectionId)
            console.log(user)
        }

        return {
            isBase64Encoded: true,
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Expose-Headers": "*",
                "Access-Control-Allow-Origin": "*",
            },
            body: "ok"
        }
    } catch (error) {
        console.log(error)
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
        return {
            isBase64Encoded: true,
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Expose-Headers": "*",
                "Access-Control-Allow-Origin": "*",
            },
            body: "ok"
        }
    } catch (error) {
        console.log(error);
    }
    
}