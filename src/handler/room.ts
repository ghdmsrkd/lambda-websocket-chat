import { getResponse } from "../common/util/response";
import RoomRepository from "../common/ddb/room/room.repo";

// http room에 대한 헨들러
export const roomHandler = async (event: any, context: any, callback: any) => {
    // console.log(event)
    const method = event.httpMethod
    const roomRepo = RoomRepository.getInstance()
    try {
        if(method === "GET") { // 생성된 모든 체팅 방을 전달한다.
            const rooms = await roomRepo.getAllRooms()
            return getResponse("success", rooms)
        } else if(method === "POST") { // 하나의 채팅 방을 생성한다.
            const { room_name } = JSON.parse(event.body)
            const room = await roomRepo.createRoom(room_name)
            return getResponse("success", room)
        }
        
    } catch (error) {
        console.log(error)
        return getResponse("fail", error, 500)
    }
}