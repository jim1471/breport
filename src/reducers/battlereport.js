import RelatedService from 'api/RelatedService'
import { getNames } from 'reducers/names'

const SAVE_BR = 'SAVE_BR'
const GET_BR = 'GET_BR'


export const saveBR = (teams, systemID, time) => ({
  type: GET_BR,
  apiCall: () => RelatedService.saveComposition(teams, systemID, time),
})

export const getBR = brID => dispatch => {
  dispatch({
    type: GET_BR,
    apiCall: () => RelatedService.getComposition(brID),
  }).then(data => {
    if (data.status === 'SUCCESS') {
      const killmailsData = data.relateds.reduce((allKms, related) => allKms.concat(related.kms), [])
      dispatch(getNames(killmailsData))
    }
  })
}


const initialState = {
  br: {},
  saving: {},
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
          // success: !!action.data.relateds,
          ...action.data,
        },
      }

    default:
      return state
  }

}
