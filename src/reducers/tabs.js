const SET_CURR_TAB = 'SET_CURR_TAB'


export const setTab = currTab => ({ type: SET_CURR_TAB, currTab })


const initialState = {
  currTab: 'involved',
  // currTab: 'timeline',
}


export default (state = initialState, action) => {

  switch (action.type) {

    case SET_CURR_TAB:
      return {
        currTab: action.currTab,
      }

    default:
      return state
  }

}
