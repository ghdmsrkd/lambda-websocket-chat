import * as dynamoose from "dynamoose"

export const RoomSchema = new dynamoose.Schema({
  room_id: {
    type: String,
    hashKey: true,
    required: true,
  },
  created_at: {
    type: Number,
    rangeKey: true,
    required: true,
  },
  room_name: {
    type: String,
    required: true
  }
})
