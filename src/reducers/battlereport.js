import RelatedService from 'api/RelatedService'
import { getNames } from 'reducers/names'
import { initializeBrData } from 'reducers/related'
import * as StatsUtils from 'utils/StatsUtils'

const SAVE_BR = 'SAVE_BR'
const GET_BR = 'GET_BR'
const SET_BR_DATA = 'SET_BR_DATA'
const SET_STATUS = 'SET_STATUS'
const FETCH_INTERVAL = 1000

export const setStatus = status => ({ type: SET_STATUS, status })

export const saveBR = (teams, systemID, time) => ({
  type: GET_BR,
  apiCall: () => RelatedService.saveComposition(teams, systemID, time),
})

export const getBR = brID => dispatch => {
  dispatch(setStatus('fetching br composition'))
  dispatch({
    type: GET_BR,
    apiCall: () => RelatedService.getComposition(brID),
  }).then(data => {
    if (data.status === 'processing') {
      console.log('br still being processed...')
      setTimeout(() => dispatch(getBR(brID)), FETCH_INTERVAL)

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
      }

    default:
      return state
  }

}
