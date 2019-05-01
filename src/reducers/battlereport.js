import RelatedService from 'api/RelatedService'
import { getNames } from 'reducers/names'
import { initializeBrData } from 'reducers/related'

const SAVE_BR = 'SAVE_BR'
const GET_BR = 'GET_BR'
const SET_STATUS = 'SET_STATUS'


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
    if (data.status === 'SUCCESS') {
      const killmailsData = data.relateds.reduce((allKms, related) => allKms.concat(related.kms), [])
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
      }))
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

    case SET_STATUS:
      return {
        ...state,
        status: action.status,
      }

    default:
      return state
  }

}
