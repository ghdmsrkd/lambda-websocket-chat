import { Document } from "dynamoose/dist/Document"

export class MessageModel extends Document {
  room_id = ""
  created_at = 0
  user_id = ""
  message = ""
}
