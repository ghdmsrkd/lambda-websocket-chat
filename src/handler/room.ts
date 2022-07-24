import { getResponse } from "../common/util/response";
import RoomRepository from "../common/ddb/room/room.repo";

export const roomHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    const method = event.httpMethod
    const roomRepo = RoomRepository.getInstance()
    try {
        if(method === "GET") {
            const rooms = await roomRepo.getAllRooms()
            return getResponse("success", rooms)
        } else if(method === "POST") {
            const { room_name } = JSON.parse(event.body)
            const room = await roomRepo.createRoom(room_name)
            return getResponse("success", room)
        }
        
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
}