import * as ddb from "./common/ddb"
import UserRepository from "./common/ddb/user/user.repo"

exports.websocketHandler = async (event: any, context: any, callback: any) => {
    console.log(`${event.requestContext.eventType} : ${event.requestContext.connectionId}`)
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