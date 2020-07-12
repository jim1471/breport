import ParseUtils from 'utils/ParseUtils'
import { brParseTeams } from 'reducers/related'

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const NOTIFY = 'NOTIFY'

const SETTINGS_STORAGE = 'settings'

export const updateSettings = (newSettings, reparseNeeded) => (dispatch, getState) => {
  const { settings } = getState()
  const payload = { ...settings, ...newSettings }
  localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(payload))
  dispatch({ type: UPDATE_SETTINGS, payload })
  ParseUtils.setSettings(payload)
  if (reparseNeeded) {
    dispatch(brParseTeams())
  }
}

export const toggleSetting = settingKey => (dispatch, getState) => {
  const { settings } = getState()
  const oldValue = settings[settingKey]
  const reparseNeeded = ['countFightersAsSquad', 'ignoreDamageToStructures'].includes(settingKey)
  dispatch(updateSettings({ [settingKey]: !oldValue }, reparseNeeded))
}

const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE)) || {}

const initialState = {
  // ignoreDamageToStructures: true,
  // countFightersAsSquad: true,
  // showExtendedStatistics: true,
  // extraShipsExpanded: false,
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
