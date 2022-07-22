import { Document } from "dynamoose/dist/Document"

export class RoomModel extends Document {
  room_id = ""
  created_at = 0
  room_name = ""
}
