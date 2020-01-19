import isEmpty from 'lodash/isEmpty'
import RelatedService from 'api/RelatedService'
import ParseUtils from 'utils/ParseUtils'
import { moveMemberToTeam } from 'utils/TeamsUtils'
import { getNames } from 'reducers/names'


const FETCH_INTERVAL = 2000

let stubData = []
const isStub = false
if (process.env.NODE_ENV === 'development' && isStub) {
  // stubData = require('./data/2019-03-03-komodo.json')
  stubData = require('./data/20190316-lightdata.json')
}

const REPARSE_TEAMS = 'REPARSE_TEAMS'
const GET_RELATED_DATA_STARTED = 'GET_RELATED_DATA_STARTED'
const GET_RELATED_DATA_ERROR = 'GET_RELATED_DATA_ERROR'
const GET_RELATED_DATA_SUCCESS = 'GET_RELATED_DATA_SUCCESS'
const PARSE_DATA_STARTED = 'PARSE_DATA_STARTED'
const PARSE_DATA = 'PARSE_DATA'
const MOVE_TO_TEAM = 'MOVE_TO_TEAM'
const INITIALIZE_BR_DATA = 'INITIALIZE_BR_DATA'
const SET_BR_INFO = 'SET_BR_INFO'


export const setBrInfo = relateds => ({
  type: SET_BR_INFO,
  relateds,
})

export const getRelatedDataStub = () => dispatch => {
  dispatch({ type: GET_RELATED_DATA_STARTED })
  setTimeout(
    () => {
      dispatch({ type: GET_RELATED_DATA_SUCCESS, payload: { data: stubData } })
      const killmailsData = stubData.kms
      dispatch(getNames(killmailsData))
      console.log(`received kms: ${stubData.kms.length} count`)
    },
    200,
  )
}

export const getRelatedData = (systemID, time, stillProcessing) => dispatch => {
  dispatch({ type: GET_RELATED_DATA_STARTED, stillProcessing })
  return RelatedService.fetchRelatedData(systemID, time)
    .then(({ data }) => {
      if (data.result === 'processing') {
        console.log('related still being processed.........')
        setTimeout(() => dispatch(getRelatedData(systemID, time, true)), FETCH_INTERVAL)
        // dispatch({ type: GET_RELATED_DATA_ERROR })
      } else if (data.result === 'success') {
        if (process.env.NODE_ENV === 'development') {
          console.log('related data:', data)
        }
        dispatch({ type: GET_RELATED_DATA_SUCCESS, payload: { data } })
        const killmailsData = data.kms
        if (isEmpty(killmailsData)) {
          const error = 'No killmails for this system and datetime.'
          console.error(error)
          dispatch({ type: 'PARSE_NAMES_FAILED', payload: { err: error } })
        } else {
          dispatch(getNames(killmailsData))
        }
      } else {
        const error = `unknown response: ${data.result}`
        console.error(error, data)
        dispatch({ type: GET_RELATED_DATA_ERROR, error })
      }
    })
    .catch(error => {
      console.error('error:', error)
      dispatch({ type: GET_RELATED_DATA_ERROR, error })
    })
}

export const parseData = () => (dispatch, getState) => {
  const { names: { involvedNames } } = getState()
  dispatch(({ type: PARSE_DATA_STARTED }))
  setTimeout(() => dispatch(({ type: PARSE_DATA, involvedNames })), 200)
}

export const moveToTeam = (ixFrom, ixTo, member) => (dispatch, getState) => {
  const { names: { involvedNames } } = getState()
  dispatch({ type: MOVE_TO_TEAM, payload: { ixFrom, ixTo, member } })
  dispatch({ type: REPARSE_TEAMS, involvedNames })
}

export const initializeBrData = initialBrData => dispatch => {
  dispatch({ type: INITIALIZE_BR_DATA, initialBrData })
}

export const brParseTeams = () => (dispatch, getState) => {
  const { names: { involvedNames } } = getState()
  dispatch({ type: REPARSE_TEAMS, involvedNames })
}


const initialState = {
  isStub,
  kmLoading: false,
  stillProcessing: false,
  error: '',
  kmData: null,
  teams: null,
  relateds: [],
  datetime: '',
  systemID: '',

  teamsLosses: null,
  teamsInvolved: null,
  teamsShips: null,
  teamsStats: null,
}


export default (state = initialState, action) => {

  switch (action.type) {

    case GET_RELATED_DATA_STARTED: {
      return {
        ...initialState,
        kmLoading: true,
        stillProcessing: action.stillProcessing,
      }
    }

    case GET_RELATED_DATA_ERROR: {
      return {
        ...state,
        kmLoading: false,
        stillProcessing: false,
        error: action.error,
      }
    }

    case GET_RELATED_DATA_SUCCESS: {
      const { data } = action.payload
      return {
        ...state,
        kmLoading: false,
        stillProcessing: false,
        error: '',
        kmData: data.kms,
        datetime: data.datetime,
        systemID: data.systemID,
      }
    }

    case PARSE_DATA_STARTED: {
      return {
        ...initialState,
        kmData: state.kmData,
        datetime: state.datetime,
        systemID: state.systemID,
      }
    }

    case PARSE_DATA: {
      return {
        ...state,
        ...ParseUtils.mainParse(state.kmData, action.involvedNames),
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

    case REPARSE_TEAMS: {
      const parseResult = ParseUtils.parseTeams(state.teams, state.kmData, action.involvedNames)
      return {
        ...state,
        ...parseResult,
        origTeams: state.origTeams,
      }
    }

    case INITIALIZE_BR_DATA: {
      const data = action.initialBrData
      return {
        ...initialState,
        kmData: data.kmData,
        teams: data.teams,
        relateds: data.relateds,
        // TODO: multiple relateds systems / timings
        datetime: data.datetime,
        systemID: data.systemID,
      }
    }

    case SET_BR_INFO: {
      return {
        ...state,
        relateds: action.relateds,
      }
    }

    default:
      return state
  }
}
