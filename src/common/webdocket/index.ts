import * as AWS from "aws-sdk"

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
    return await this.apiGatewayManagementApi.postToConnection({
      ConnectionId: id,
      Data: JSON.stringify(data)
    }).promise();
  }
}