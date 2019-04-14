import { combineReducers } from 'redux'
import related from './related'
import battlereport from './battlereport'

const reducers = combineReducers({
  related,
  battlereport,
})

export default reducers
