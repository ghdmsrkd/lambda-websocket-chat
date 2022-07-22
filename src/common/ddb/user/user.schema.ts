import * as dynamoose from "dynamoose"

export const UserSchema = new dynamoose.Schema({
  connection_id: {
    type: String,
    hashKey: true,
    required: true,
  },
  room_id: {
    type: String,
    index: {
      name: "room_id-user_id-index",
      global: true,
    },
    required: true
  },
  user_id: {
    type: String,
    required: true,
  },
})
