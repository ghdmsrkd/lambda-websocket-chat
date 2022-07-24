import * as dynamoose from "dynamoose"
import { UserModel } from "./user.model"
import { Model } from "dynamoose/dist/Model"
import { UserSchema } from "./user.schema"

export default class UserRepository {
  private dbInstance: Model<UserModel>
  static instance: UserRepository

  private constructor() {
    const tableName = "CHAT_USER"
    this.dbInstance = dynamoose.model<UserModel>(tableName, UserSchema)
  }

  static getInstance() {
    if(!this.instance) this.instance = new UserRepository()
    return this.instance
  }

  createUser = async (connection_id: string, room_id: string, user_id: string) => {
    return await this.dbInstance.create({
      connection_id,
      room_id,
      user_id,
    })
  }

  getUserById = async (id: string) => {
    return await this.dbInstance.get({ connection_id: id })
  }

  getUsersByRoomId = async (room_id: string) => {
    return await this.dbInstance.query("room_id").eq(room_id).exec()
  }

  deleteUserById = async (id: string) => {
    const user = await this.getUserById(id)
    await this.dbInstance.delete(id)
    return user
  }
}
