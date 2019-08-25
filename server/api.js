const axios = require('axios')
// const base = 'http://192.168.0.12:4000'
const base = 'https://infinite-forest-76055.herokuapp.com'


const axiosConfig = {
  timeout: 30000,
  headers: {
    'Accept': 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
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

const fetchRelatedSummaryData = (systemID, time) => {
  const params = {
    method: 'post',
    url: `${base}/api/v1/related-summary`,
    data: { systemID, time },
  }
  return API(params)
    .catch(error => Promise.reject(castError(error)))
}

module.exports = {
  fetchRelatedSummaryData,
}
