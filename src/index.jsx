import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { FocusStyleManager } from '@blueprintjs/core/lib/esm/accessibility/focusStyleManager'
import configureStore from './store'
import Router from './router'

FocusStyleManager.onlyShowFocusOnTabs()

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
)

/* eslint-disable */
// debug - removes displaying __proto__ from objects in console
console.debug = function() {
  function clear(o) {

    var obj = JSON.parse(JSON.stringify(o))
    // [!] clone

    if (obj && typeof obj === 'object') {
      obj.__proto__ = null
      // clear

      for (var j in obj) {
        obj[j] = clear(obj[j]) // recursive
      }
    }
    return obj;
  }
  for (var i = 0, args = Array.prototype.slice.call(arguments, 0); i < args.length; i++) {
    args[i] = clear(args[i])
  }
  console.log.apply(console, args)
}

if (process.env.NODE_ENV === 'development') {
  // remove annoying warning from React-Router 3:
  // "Warning: [react-router] You cannot change <Router routes>; it will be ignored"
  // https://github.com/reactjs/react-router/issues/2182
  console.error = (() => {
    const error = console.error
    return function (exception) {
      return (exception && typeof exception === 'string' && exception.match(/change <Router /))
        ? undefined
        : error.apply(console, arguments)
    }
  })()
}
/* eslint-enable */


ReactDOM.render(<App />, document.getElementById('react-root'))
