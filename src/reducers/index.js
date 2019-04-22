import { combineReducers } from 'redux'
import related from './related'
import battlereport from './battlereport'
import names from './names'

const reducers = combineReducers({
  related,
  battlereport,
  names,
})

export default reducers
