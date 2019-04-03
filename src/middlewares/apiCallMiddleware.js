
export const REQUEST_TYPE = '_STARTED'
export const SUCCESS_TYPE = '_SUCCESS'
export const FAILURE_TYPE = '_FAILURE'


const apiCallMiddleware = ({ dispatch, getState }) => next => action => {
  const { type, apiCall, shouldCallAPI, params } = action

  // Normal action: pass it on
  if (!apiCall) {
    return next(action)
  }

  // mechanism for caching || preventing duplicate requests
  if (shouldCallAPI && !shouldCallAPI(getState())) {
    return null
  }

  const requestType = `${type}${REQUEST_TYPE}`
  const successType = `${type}${SUCCESS_TYPE}`
  const failureType = `${type}${FAILURE_TYPE}`

  dispatch({ type, subtype: requestType, payload: {}, params }) // isLoading

  return apiCall()
    .then(response => {
      const { data } = response
      if (data.status === 'SUCCESS') {
        dispatch({ type, subtype: successType, payload: { result: data.result }, params })

      } else if (data.status === 'ERROR') {
        console.error(type, 'application error:', data.applicationError) // eslint-disable-line
        dispatch({ type, subtype: failureType, payload: { error: data.applicationError }, params })

      } else if (data.status === 'VALIDATION_ERROR') {
        dispatch({ type, subtype: failureType, payload: { error: data.status, validationErrors: data.validationErrors }, params })

      } else {
        dispatch({ type, subtype: failureType, payload: { error: `UNKNOWN STATUS: ${data.status}` }, params })
      }
    })
    .catch(error => dispatch({ type, subtype: failureType, payload: { error }, params }))
}

export default apiCallMiddleware
