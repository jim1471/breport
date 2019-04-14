import isEmpty from 'lodash/isEmpty'
import RelatedService from 'api/RelatedService'
import EsiService from 'api/EsiService'
import ParseUtils from 'utils/ParseUtils'
import NamesUtils from 'utils/NamesUtils'
import { moveMemberToTeam } from 'utils/TeamsUtils'

const FETCH_INTERVAL = 4000

let stubData = []
const isStub = false
if (process.env.NODE_ENV === 'development' && isStub) {
  // stubData = require('./data/2019-03-03-komodo.json')
  stubData = require('./data/20190316-lightdata.json')
}

const REPARSE_TEAMS = 'REPARSE_TEAMS'
const GET_RELATED_DATA_STARTED = 'GET_RELATED_DATA_STARTED'
const GET_RELATED_DATA_FINISHED = 'GET_RELATED_DATA_FINISHED'
const GET_RELATED_DATA = 'GET_RELATED_DATA'
const PARSE_DATA_STARTED = 'PARSE_DATA_STARTED'
const PARSE_DATA = 'PARSE_DATA'
const PARSE_NAMES_STARTED = 'PARSE_NAMES_STARTED'
const PARSE_NAMES = 'PARSE_NAMES'
const PARSE_NAMES_FAILED = 'PARSE_NAMES_FAILED'
const MOVE_TO_TEAM = 'MOVE_TO_TEAM'

export const moveToTeam = (ixFrom, ixTo, member) => dispatch => {
  dispatch({
    type: MOVE_TO_TEAM,
    payload: { ixFrom, ixTo, member },
  })
  dispatch({ type: REPARSE_TEAMS })
}

export const getNames = () => (dispatch, getState) => {
  const { br: { involvedIds } } = getState()
  const ids = NamesUtils.plainIds(involvedIds)
  const cuttedIds = ids.slice(0, 999)
  let cuttedIdsSec = ids.slice(1000)
  let cuttedIdsThird = null
  let pages = cuttedIdsSec && cuttedIdsSec.length > 0 ? 2 : 1
  if (cuttedIds.length === 0) {
    dispatch({ type: PARSE_NAMES_STARTED, pages: 0 })
    console.log('no names to fetch. cache used.')
    setTimeout(() => dispatch({ type: PARSE_NAMES, payload: { data: {} } }), 100)
    return
  }
  if (cuttedIdsSec.length > 1000) {
    console.error('sec ids size', cuttedIdsSec.length)
    cuttedIdsThird = cuttedIdsSec.slice(1000)
    cuttedIdsSec = cuttedIdsSec.slice(0, 999)
    pages = 3
  }
  // TODO: more than 3000? hm...

  dispatch({ type: PARSE_NAMES_STARTED, pages })
  EsiService.fetchNames(cuttedIds)
    .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
    .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  if (pages === 2) {
    EsiService.fetchNames(cuttedIdsSec)
      .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
      .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  }
  if (pages === 3 && cuttedIdsThird) {
    EsiService.fetchNames(cuttedIdsThird)
      .then(({ data }) => dispatch({ type: PARSE_NAMES, payload: { data } }))
      .catch(err => dispatch({ type: PARSE_NAMES_FAILED, payload: { err } }))
  }
}

export const getRelatedDataStub = () => dispatch => {
  dispatch({ type: GET_RELATED_DATA_STARTED })
  setTimeout(
    () => {
      dispatch({ type: GET_RELATED_DATA, payload: { data: stubData } })
      dispatch(getNames())
      console.log(`received kms: ${stubData.kms.length} count`)
    },
    200,
  )
}

export const getRelatedData = (systemID, time) => dispatch => {
  dispatch({ type: GET_RELATED_DATA_STARTED })
  return RelatedService.fetchRelatedData(systemID, time)
    .then(({ data }) => {
      if (data.result === 'processing') {
        console.log('related still processing.........')
        setTimeout(() => dispatch(getRelatedData(systemID, time)), FETCH_INTERVAL)
        dispatch({ type: GET_RELATED_DATA_FINISHED })
        dispatch({ type: PARSE_NAMES_FAILED, payload: { err: 'processing' } })
      } else if (data.result === 'success') {
        console.log('related data:', { result: data.result })
        dispatch({ type: GET_RELATED_DATA, payload: { data } })
        dispatch(getNames())
      } else {
        console.log('response:', { result: data.result }, data)
        dispatch({ type: GET_RELATED_DATA_FINISHED })
      }
    })
    .catch(err => {
      console.log('error:', err)
      dispatch({ type: GET_RELATED_DATA_FINISHED })
      // TODO: handle Zkillboard API errors
      dispatch({ type: PARSE_NAMES_FAILED, payload: { err } })
    })
}

export const parseData = () => dispatch => {
  dispatch(({ type: PARSE_DATA_STARTED }))
  setTimeout(() => dispatch(({ type: PARSE_DATA })), 200)
}

// const savedNames = {
//   allys: {},
//   corps: {},
//   chars: {},
//   types: {},
//   systems: {},
// }
const savedNames = JSON.parse(localStorage.getItem('names')) || {}

const initialState = {
  isStub,
  kmData: null,
  involvedNames: {
    ...savedNames,
    isLoading: true,
  },
}


export default (state = initialState, action) => {

  switch (action.type) {

    case GET_RELATED_DATA_STARTED: {
      return {
        ...state,
        kmData: null,
        kmLoading: true,
        involvedNames: {
          ...state.involvedNames,
          error: null,
        },
      }
    }

    case GET_RELATED_DATA_FINISHED: {
      return {
        ...state,
        kmLoading: false,
      }
    }

    case GET_RELATED_DATA: {
      const { data } = action.payload
      const unknownIds = NamesUtils.extractUnknownNames(data.kms, state.involvedNames)
      // console.warn('unknownIds:', NamesUtils.plainIds(unknownIds).length)
      return {
        ...state,
        kmLoading: false,
        kmData: data.kms,
        datetime: data.datetime,
        systemID: data.systemID,
        involvedIds: unknownIds,
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
        // console.warn('save to localStorage', NamesUtils.plainIds(involvedNames).length, 'names')
        localStorage.setItem('names', JSON.stringify(involvedNames))
      }
      return {
        ...state,
        involvedNames,
      }
    }

    case PARSE_DATA_STARTED: {
      return {
        ...state,
        teams: null,
        teamLossesA: null,
        teamLossesB: null,
        teamInvolvedA: null,
        teamInvolvedB: null,
        teamShipsA: null,
        teamShipsB: null,
      }
    }

    case PARSE_DATA: {
      return {
        ...state,
        ...ParseUtils.mainParse(state.kmData, state.involvedNames),
      }
    }

    case REPARSE_TEAMS: {
      return {
        ...state,
        ...ParseUtils.parseTeams(state.teams, state.kmData, state.involvedNames),
      }
    }

    case MOVE_TO_TEAM: {
      return {
        ...state,
        teams: [
          ...moveMemberToTeam(state.teams, action.payload),
        ],
      }
    }

    default:
      return state
  }
}
