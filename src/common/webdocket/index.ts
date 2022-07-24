import * as AWS from "aws-sdk"
import UserRepository from "../ddb/user/user.repo"

export class WebsocketClient {
  static instance: WebsocketClient
  private apiGatewayManagementApi: AWS.ApiGatewayManagementApi
  private constructor() {
    this.apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: 'http://localhost:3001',
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

  async sendMessage(id: string, data: any) {
    try {
      await this.apiGatewayManagementApi.postToConnection({
        ConnectionId: id,
        Data: JSON.stringify(data)
      }).promise();
    } catch (error) {
      console.error(`${id} <= This user is disconnected`)
      const userRepo = UserRepository.getInstance()
      userRepo.deleteUserById(id)
    }
    return 
  }
}