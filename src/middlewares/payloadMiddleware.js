import { endsWith, isArray } from 'lodash'
import { REQUEST_TYPE, SUCCESS_TYPE, FAILURE_TYPE } from './apiCallMiddleware'


const defaultPayload = {
  isLoading: false,
  error: null,
}

const payloadMiddleware = () => next => action => {
  const { data, error, params } = action.payload || {}

  if (!action.subtype) {
    return next(action)
  }

  if (endsWith(action.subtype, REQUEST_TYPE)) {
    action.data = {
      ...defaultPayload,
      isLoading: true,
    }
  }
  if (endsWith(action.subtype, FAILURE_TYPE)) {
    action.data = {
      ...defaultPayload,
      error,
      params,
    }
  }
  if (endsWith(action.subtype, SUCCESS_TYPE)) {
    if (isArray(action.payload.data)) {
      action.data = {
        ...defaultPayload,
        data: action.payload.data,
      }
    } else {
      action.data = {
        ...data,
        ...defaultPayload,
      }
    }
  }

  return next(action)
}

export default payloadMiddleware
