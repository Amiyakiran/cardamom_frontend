import axios from "axios"



export const commonApi = async (method, url, body, reqHeader) => {
  const reqConfig = {
    method,
    url,
    data: body,
    withCredentials: true,//This allows the browser to send/receive cookies for your API.
    headers:reqHeader? reqHeader : { "content-type": "application/json" }
  }
  return await axios(reqConfig).then((res) => {
    return res
  }).catch((err) => {
    return err
  })
}

