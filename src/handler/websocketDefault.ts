import { getResponse } from "../common/util/response";

// websocket $default에 해당하는 헨들러
export const websocketDefaultHandler = async (event: any, context: any, callback: any) => {
    console.log(event)
    return getResponse("success", "This is default route. You should set abled route")
}