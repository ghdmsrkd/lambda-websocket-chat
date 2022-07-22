import { Document } from "dynamoose/dist/Document"

export class UserModel extends Document {
  connection_id = ""
  room_id = ""
  user_id = ""
}
