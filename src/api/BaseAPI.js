import axios from 'axios'


const API_CALL_TIMEOUT = 180000


const axiosConfig = {
  // baseURL: '/api/',
  timeout: API_CALL_TIMEOUT,
  headers: {
    'Accept': 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
}

const API = axios.create(axiosConfig)

// normalization for axios http-errors
const castError = error => {
  const { response } = error
  const errorResult = response ? response.data : error
  if (process.env.NODE_ENV !== 'production') {
    console.error('API:', errorResult) // eslint-disable-line
  }
  return errorResult
}


class BaseAPI {
  call({ data, method, url, params, headers, baseURL }) {
    const callParams = {
      method, url, data, params, headers,
      baseURL: baseURL || API.defaults.baseURL,
    }
    return API(callParams)
      .catch(error => Promise.reject(castError(error)))
  }
}

export default BaseAPI
