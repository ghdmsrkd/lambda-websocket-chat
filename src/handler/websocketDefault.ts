import { getResponse } from "../common/util/response";

export const websocketDefaultHandler = async (event: any, context: any, callback: any) => {
    console.log(event)
    return getResponse("success", "This is default route. You should set abled route")
}