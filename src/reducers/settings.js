import ParseUtils from 'utils/ParseUtils'
import { brParseTeams } from 'reducers/related'

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const NOTIFY = 'NOTIFY'


export const updateSettings = newSettings => (dispatch, getState) => {
  const { settings } = getState()
  const payload = { ...settings, ...newSettings }
  dispatch({ type: UPDATE_SETTINGS, payload })
  ParseUtils.setSettings(payload)
  dispatch(brParseTeams())
}


const initialState = {
  // ignoreDamageToStructures: true,
  // countFightersAsSquad: true,
  // showExtendedStatistics: true,
  ...ParseUtils.DEFAULT_SETTINGS,
}


export default (state = initialState, action) => {
  const { payload } = action

  switch (action.type) {
    case UPDATE_SETTINGS: {
      return { ...state, ...payload }
    }

    default:
      return state
  }

}
