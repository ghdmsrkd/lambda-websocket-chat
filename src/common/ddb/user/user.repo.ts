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

  createUserById = async (id: string) => {
    return await this.dbInstance.create({
      user_id: id,
      user_name: "name",
    })
  }

  getUserById = async (id: string) => {
    return await this.dbInstance.get({ user_id: id })
  }

  deleteUserById = async (id: string) => {
    const user = await this.getUserById(id)
    await this.dbInstance.delete(id)
    return user
  }
}
