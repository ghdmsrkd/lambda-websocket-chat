import * as AWS from "aws-sdk"
import UserRepository from "../ddb/user/user.repo"

console.log(process.env)
export class WebsocketClient {
  static instance: WebsocketClient
  private apiGatewayManagementApi: AWS.ApiGatewayManagementApi
  private constructor() {
    this.apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.CONNECTION_URL,
    })
  }

  static getInstance() {
    if(!this.instance) this.instance = new WebsocketClient()
    return this.instance
  }

  async getStatus(id: string) {
    return await this.apiGatewayManagementApi.getConnection({ConnectionId: id}).promise()
  }

  async disconnect(id: string) {
    await this.apiGatewayManagementApi.deleteConnection({ConnectionId: id}).promise()
  }

  async joinedRoom(connection: string, user_id: string) {
    const data = {
      action: "sendMessage",
      room_id: "",
      user_id: user_id,
      message: `'${user_id}' 님이 입장하셨습니다.`
    }
    this.sendMessage(connection, data)
  }

  async leavedRoom(connection: string, user_id: string) {
    const data = {
      action: "sendMessage",
      room_id: "",
      user_id: user_id,
      message: `'${user_id}' 님이 떠나셨습니다.`
    }
    this.sendMessage(connection, data)
  }

  async sendMessage(id: string, data: any) {
    try {
      await this.apiGatewayManagementApi.postToConnection({
        ConnectionId: id,
        Data: JSON.stringify(data)
      }).promise();
    } catch (error) {
      console.error(error)
      console.log(`${id} <= This user is disconnected`)
      const userRepo = UserRepository.getInstance()
      userRepo.deleteUserById(id)
    }
  }
}