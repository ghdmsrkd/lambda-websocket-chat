import * as dynamoose from "dynamoose"

export const MessageSchema = new dynamoose.Schema({
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
  user_id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})
