import { hot } from 'react-hot-loader'
import React from 'react'
import 'styles/common.scss'


class App extends React.Component {

  render() {
    return this.props.children
  }

}

export default hot(module)(App)
