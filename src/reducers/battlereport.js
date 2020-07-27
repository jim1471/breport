import RelatedService from 'api/RelatedService'
import { getNames, stopLoading } from 'reducers/names'
import { initializeBrData } from 'reducers/related'
import * as StatsUtils from 'utils/StatsUtils'

const stubData = {} // require('./data/stub-br.json')

const SAVE_BR = 'SAVE_BR'
const GET_BR = 'GET_BR'
const SET_BR_DATA = 'SET_BR_DATA'
const SET_STATUS = 'SET_STATUS'
const RESET_BR = 'RESET_BR'
const FETCH_INTERVAL = 1000

export const setStatus = (status, error = '') => ({ type: SET_STATUS, status, error })

export const saveBR = (teams, systemID, time) => ({
  type: GET_BR,
  apiCall: () => RelatedService.saveComposition(teams, systemID, time),
})

export const resetBr = () => ({ type: RESET_BR })

export const getStubBR = () => dispatch => {
  dispatch(setStatus('fetching br composition'))
  const data = stubData
  const killmailsData = data.relateds.reduce((allKms, related) => allKms.concat(related.kms), [])
  if (data.new) {
    const relatedsWithStats = data.relateds.map(rel => ({
      ...rel,
      ...StatsUtils.getKmsGeneralStats(rel.kms),
    }))
    const parsedBrData = {
      ...data,
      new: true,
      systemID: data.relateds[0].systemID,
      // time: data.relateds[0].time,
      time: null,
      kmData: killmailsData,
      teams: data.teams,
      relateds: relatedsWithStats,
      viewed: data.viewed,
    }
    dispatch(initializeBrData(parsedBrData))
    dispatch({ type: 'SET_BR_DATA', parsedBrData })
  } else {
    dispatch(initializeBrData({
      systemID: data.relateds[0].systemID,
      time: data.relateds[0].time,
      kmData: killmailsData,
      teams: data.teams,
      relateds: data.relateds.map(rel => ({
        relatedKey: rel.relatedKey,
        systemID: rel.systemID,
        time: rel.time,
      })),
      viewed: data.viewed,
    }))
  }

  dispatch(setStatus('fetching names'))
  dispatch(getNames(killmailsData))
}

export const getBR = brID => dispatch => {
  dispatch(setStatus('fetching br composition'))
  return dispatch({
    type: GET_BR,
    apiCall: () => RelatedService.getComposition(brID),
  }).then(data => {
    if (data.status === 'processing') {
      console.log('br still being processed...')
      setTimeout(() => dispatch(getBR(brID)), FETCH_INTERVAL)

    } else if (data.status === 'error') {
      dispatch(setStatus(data.status, data.error))
      dispatch(stopLoading())

    } else if (data.status === 'success') {
      const killmailsData = data.relateds.reduce((allKms, related) => allKms.concat(related.kms), [])
      if (data.new) {
        const relatedsWithStats = data.relateds.map(rel => ({
          ...rel,
          ...StatsUtils.getKmsGeneralStats(rel.kms),
        }))
        const parsedBrData = {
          ...data,
          new: true,
          systemID: data.relateds[0].systemID,
          // time: data.relateds[0].time,
          time: null,
          kmData: killmailsData,
          teams: data.teams,
          relateds: relatedsWithStats,
          viewed: data.viewed,
        }
        dispatch(initializeBrData(parsedBrData))
        dispatch({ type: 'SET_BR_DATA', parsedBrData })
      } else {
        dispatch(initializeBrData({
          systemID: data.relateds[0].systemID,
          time: data.relateds[0].time,
          kmData: killmailsData,
          teams: data.teams,
          relateds: data.relateds.map(rel => ({
            relatedKey: rel.relatedKey,
            systemID: rel.systemID,
            time: rel.time,
          })),
          viewed: data.viewed,
        }))
      }

      dispatch(setStatus('fetching names'))
      dispatch(getNames(killmailsData))
    }
  })
}


const initialState = {
  br: {
    relateds: [],
    teams: [],
    status: '',
    isLoading: false,
    viewed: 0,
  },
  saving: {},
  status: '',
}


export default (state = initialState, action) => {

  switch (action.type) {

    case SAVE_BR:
      return {
        ...state,
        saving: {
          ...action.result,
        },
      }

    case GET_BR:
      return {
        ...state,
        br: {
          ...action.data,
        },
      }

    case SET_BR_DATA:
      return {
        ...state,
        br: {
          ...action.parsedBrData,
        },
      }

    case SET_STATUS:
      return {
        ...state,
        status: action.status,
        error: action.error,
      }

    case RESET_BR:
      return initialState

    default:
      return state
  }

}
