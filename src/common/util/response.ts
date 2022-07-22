
const getResponse = (result: "success" | "fail", data: any = "", statusCode: number = 200) => {
  return {
    statusCode: statusCode,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data)
}
}

export {
  getResponse
}