import { hot } from 'react-hot-loader'
import React from 'react'
import { Spinner } from 'components'
import { loadData } from 'data/constants'
import 'styles/common.scss'


class App extends React.Component {

  state = { loaded: false }

  componentDidMount() {
    loadData()
      .then(() => {
        console.log('items loaded')
        this.setState({ loaded: true })
      })
      .catch(e => console.error(e))
  }

  render() {
    const { loaded } = this.state
    if (!loaded) {
      return <Spinner />
    }
    return this.props.children
  }

}

export default hot(module)(App)
