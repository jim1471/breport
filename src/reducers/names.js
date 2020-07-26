import isEmpty from 'lodash/isEmpty'
import EsiService from 'api/EsiService'
import NamesUtils from 'utils/NamesUtils'


const PARSE_NAMES_STARTED = 'PARSE_NAMES_STARTED'
const PARSE_NAMES = 'PARSE_NAMES'
const PARSE_NAMES_FAILED = 'PARSE_NAMES_FAILED'
const STOP_LOADING = 'STOP_LOADING'

export const stopLoading = () => ({ type: STOP_LOADING })

export const getNames = killmailsData => (dispatch, getState) => {
  const { names: { involvedNames } } = getState()
  const unknownIds = NamesUtils.extractUnknownNames(killmailsData, involvedNames)
  const ids = NamesUtils.plainIds(unknownIds)

  const cuttedIds = ids.slice(0, 999)
  let cuttedIdsSec = ids.slice(1000)
  let cuttedIdsThird = null
  let cuttedIdsForth = null
  let pages = cuttedIdsSec && cuttedIdsSec.length > 0 ? 2 : 1
  if (cuttedIds.length === 0) {
    dispatch({ type: PARSE_NAMES_STARTED, pages: 0 })
    console.log('-- no names to fetch. cache used.')
    setTimeout(() => dispatch({ type: PARSE_NAMES, payload: { data: {} } }), 100)
    return
  }
  if (cuttedIdsSec.length > 1000) {
    console.log('sec ids size', cuttedIdsSec.length)
    cuttedIdsThird = cuttedIdsSec.slice(1000)
    cuttedIdsSec = cuttedIdsSec.slice(0, 999)
    pages = 3
  }
  if (cuttedIdsThird && cuttedIdsThird.length > 1000) {
    console.log('third ids size', cuttedIdsThird.length)
    cuttedIdsForth = cuttedIdsThird.slice(1000)
    cuttedIdsThird = cuttedIdsThird.slice(0, 999)
    pages = 4
  }
  // more than 3000? hm...
  // damn yes, for example
  // Keepstar in H-5GUI (Vale of the Silent) 20/11/2018
  // /related/30000225/201811192300/

  // TODO: refactor this shit
  dispatch({ type: PARSE_NAMES_STARTED, pages })
  EsiService.fetchNames(cuttedIds)
    .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
    .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  if (pages >= 2) {
    EsiService.fetchNames(cuttedIdsSec)
      .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
      .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  }
  if (pages >= 3 && cuttedIdsThird) {
    EsiService.fetchNames(cuttedIdsThird)
      .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
      .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  }
  if (pages >= 4 && cuttedIdsForth) {
    EsiService.fetchNames(cuttedIdsForth)
      .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
      .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  }
}

NamesUtils.printLocalStorageSpace()

let savedNames = JSON.parse(localStorage.getItem('names')) || {}

if (!savedNames.version || savedNames.version !== 1) {
  localStorage.clear()
  savedNames = null
}

const initialState = {
  involvedNames: {
    ...savedNames,
    error: '',
    pages: 0,
    isLoading: true,
  },
}


export default (state = initialState, action) => {

  switch (action.type) {

    case STOP_LOADING: {
      return {
        ...state,
        involvedNames: {
          ...state.involvedNames,
          isLoading: false,
        },
      }
    }

    case PARSE_NAMES_STARTED: {
      return {
        ...state,
        involvedNames: {
          ...state.involvedNames,
          error: null,
          pages: action.pages,
          isLoading: true,
        },
      }
    }

    case PARSE_NAMES_FAILED: {
      const { err } = action.payload
      return {
        ...state,
        involvedNames: {
          ...state.involvedNames,
          error: err,
          pages: 0,
          isLoading: false,
        },
      }
    }

    case PARSE_NAMES: {
      const { data = {} } = action.payload
      if (isEmpty(data) || data.error) {
        return {
          ...state,
          involvedNames: {
            ...state.involvedNames,
            error: data.error,
            pages: 0,
            isLoading: false,
          },
        }
      }

      const remainingPages = state.involvedNames.pages - 1
      const involvedNames = {
        ...NamesUtils.parseNames(data, state.involvedNames),
        pages: remainingPages,
        isLoading: remainingPages > 0,
      }
      if (remainingPages === 0) {
        localStorage.setItem('names', JSON.stringify(involvedNames))
        NamesUtils.printLocalStorageSpace('Names cached. Current local storage:')
      }
      return {
        ...state,
        involvedNames,
      }
    }

    default:
      return state
  }

}
