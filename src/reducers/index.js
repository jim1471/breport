import { combineReducers } from 'redux'
import related from './related'
import battlereport from './battlereport'
import names from './names'
import tabs from './tabs'
import settings from './settings'

const reducers = combineReducers({
  related,
  battlereport,
  names,
  tabs,
  settings,
})

export default reducers
