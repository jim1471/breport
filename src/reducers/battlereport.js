import RelatedService from 'api/RelatedService'


const SAVE_BR_START = 'SAVE_BR_START'
const SAVE_BR_SUCCESS = 'SAVE_BR_SUCCESS'
const SAVE_BR_ERROR = 'SAVE_BR_ERROR'
const GET_BR = 'GET_BR'


export const saveBR = (teams, systemID, time) => dispatch => {
  dispatch({ type: SAVE_BR_START })
  RelatedService.saveComposition(teams, `${systemID}/${time}`)
    .then(({ data }) => {
      console.log('data', data)
      if (data && data.id) {
        dispatch({ type: SAVE_BR_SUCCESS, brID: data.id })
      }
    })
    .catch(error => {
      dispatch({ type: SAVE_BR_ERROR, error })
      console.error('error:', error)
    })
}

export const getBR = brID => ({
  type: GET_BR,
  apiCall: () => RelatedService.getComposition(brID),
})


const initialState = {
  brID: null,
  br: null,
  data: null,
  // names: null,
}


export default (state = initialState, action) => {

  switch (action.type) {

    case SAVE_BR_START: {
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    }

    case SAVE_BR_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        brID: action.brID,
      }
    }

    case SAVE_BR_ERROR: {
      return {
        ...state,
        isLoading: false,
        brID: null,
        error: action.error,
      }
    }

    case GET_BR:
      return {
        ...state,
        br: {
          ...action.result,
        },
      }

    default:
      return state
  }

}
