import * as dynamoose from "dynamoose"
import { RoomModel } from "./room.model"
import { Model } from "dynamoose/dist/Model"
import { RoomSchema } from "./room.schema"
import * as uuid from "uuid"

export default class RoomRepository {
  private dbInstance: Model<RoomModel>
  static instance: RoomRepository

  private constructor() {
    const tableName = "CHAT_ROOM"
    this.dbInstance = dynamoose.model<RoomModel>(tableName, RoomSchema)
  }

  static getInstance() {
    if(!this.instance) this.instance = new RoomRepository()
    return this.instance
  }

  createRoom = async (room_name: string) => {
    return await this.dbInstance.create({
      room_id: uuid.v4(),
      created_at: Number(new Date()),
      room_name
    })
  }

  getRoom = async (id: string) => {
    return await this.dbInstance.get({ room_id: id })
  }

  getAllRooms = async  () => {
    return await this.dbInstance.scan().exec()
  }

}
