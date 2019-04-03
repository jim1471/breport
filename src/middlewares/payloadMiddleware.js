import { endsWith, isArray } from 'lodash'
import { REQUEST_TYPE, SUCCESS_TYPE, FAILURE_TYPE } from './apiCallMiddleware'


const defaultPayload = {
  isLoading: false,
  error: null,
}

const payloadMiddleware = () => next => action => {
  const { result, error, params } = action.payload || {}

  if (!action.subtype) {
    return next(action)
  }

  if (endsWith(action.subtype, REQUEST_TYPE)) {
    action.result = {
      ...defaultPayload,
      isLoading: true,
    }
  }
  if (endsWith(action.subtype, FAILURE_TYPE)) {
    action.result = {
      ...defaultPayload,
      error,
      params,
    }
  }
  if (endsWith(action.subtype, SUCCESS_TYPE)) {
    if (isArray(action.payload.result)) {
      action.result = {
        ...defaultPayload,
        data: action.payload.result,
      }
    } else {
      action.result = {
        ...result,
        ...defaultPayload,
      }
    }
  }

  return next(action)
}

export default payloadMiddleware
