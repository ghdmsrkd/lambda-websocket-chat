import * as dynamoose from "dynamoose"

export const UserSchema = new dynamoose.Schema({
  user_id: {
    type: String,
    hashKey: true,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
})
