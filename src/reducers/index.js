import { combineReducers } from 'redux'
import related from './related'
import battlereport from './battlereport'
import names from './names'
import tabs from './tabs'

const reducers = combineReducers({
  related,
  battlereport,
  names,
  tabs,
})

export default reducers
