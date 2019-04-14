import RelatedService from 'api/RelatedService'


const SAVE_BR_START = 'SAVE_BR_START'
const SAVE_BR_SUCCESS = 'SAVE_BR_SUCCESS'
const SAVE_BR_ERROR = 'SAVE_BR_ERROR'


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


const initialState = {

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
        error: action.error,
      }
    }

    default:
      return state
  }

}
