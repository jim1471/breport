import ParseUtils from 'utils/ParseUtils'
import { brParseTeams } from 'reducers/related'

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const NOTIFY = 'NOTIFY'

const SETTINGS_STORAGE = 'settings'

export const updateSettings = newSettings => (dispatch, getState) => {
  const { settings } = getState()
  const payload = { ...settings, ...newSettings }
  localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(payload))
  dispatch({ type: UPDATE_SETTINGS, payload })
  ParseUtils.setSettings(payload)
  dispatch(brParseTeams())
}

const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE)) || {}

const initialState = {
  // ignoreDamageToStructures: true,
  // countFightersAsSquad: true,
  // showExtendedStatistics: true,
  ...ParseUtils.DEFAULT_SETTINGS,
  ...savedSettings,
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
