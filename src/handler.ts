exports.websocketHandler = (event: any, context: any, callback: any) => {
    console.log(event.requestContext.eventType)
    console.log(event.requestContext.connectionId)
    return {
        isBase64Encoded: true,
        statusCode: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Expose-Headers": "*",
            "Access-Control-Allow-Origin": "*",
        },
        body: "ok"
    }
}