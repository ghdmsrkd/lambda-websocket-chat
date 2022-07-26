import MessageRepository from "../common/ddb/message/message.repo"
import { getResponse } from "../common/util/response"

// http message에 해당하는 헨들러
export const messageHandler = async (event: any, context: any, callback: any) => {
  // console.log(event)
  const method = event.httpMethod
  const messageRepo = MessageRepository.getInstance()
  try {
    // 요청한 방에 대한 모든 메시지를 전달한다.
    if(method === "GET") {
        const { room_id } = event.queryStringParameters
        const message = await messageRepo.getMessages(room_id)
        return getResponse("success", message)
    }       
  } catch (error) {
      console.log(error)
      return getResponse("fail", error, 500)
  }
}