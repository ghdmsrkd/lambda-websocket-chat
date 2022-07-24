import * as dynamoose from "dynamoose"
import { MessageModel } from "./message.model"
import { Model } from "dynamoose/dist/Model"
import { MessageSchema } from "./message.schema"

export default class MessageRepository {
  private dbInstance: Model<MessageModel>
  static instance: MessageRepository

  private constructor() {
    const tableName = "CHAT_MESSAGE"
    this.dbInstance = dynamoose.model<MessageModel>(tableName, MessageSchema)
  }

  static getInstance() {
    if(!this.instance) this.instance = new MessageRepository()
    return this.instance
  }

  createMessage = async (room_id: string, user_id: string, message: string) => {
    return await this.dbInstance.create({
      room_id,
      created_at: Number(new Date()),
      user_id,
      message,
    })
  }

  getMessages = async  (room_id: string) => {
    return await this.dbInstance.query("room_id").sort("ascending").exec()
  }

}
