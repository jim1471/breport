import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import loadable from '@loadable/component'

import { FocusStyleManager } from 'components/common/blueprint'
import { Spinner } from 'components'
import { loadData } from 'data/constants'
import routerHistory from 'utils/routerHistory'
import MaintenancePage from 'pages/Dashboard/MaintenancePage'
import configureStore from './store'
import 'styles/common.scss'

FocusStyleManager.onlyShowFocusOnTabs()

const store = configureStore()

const MAINTENANCE = true

const Dashboard = loadable(
  () => import(/* webpackChunkName: "Dashboard" */'pages/Dashboard'),
  { fallback: <Spinner /> },
)
const CreateBattleReport = loadable(
  () => import(/* webpackChunkName: "CreateBR" */'pages/CreateBattleReport'),
  { fallback: <Spinner /> },
)
const RelatedPage = loadable(
  () => import(/* webpackChunkName: "RelatedPage" */'pages/RelatedPage'),
  { fallback: <Spinner /> },
)
const BattleReportPage = loadable(
  () => import(/* webpackChunkName: "BRPage" */'pages/BattleReportPage'),
  { fallback: <Spinner /> },
)
const Legal = loadable(
  () => import(/* webpackChunkName: "Legal" */'pages/Legal'),
  { fallback: <Spinner /> },
)


class App extends React.Component {

  state = { loaded: false }

  componentDidMount() {
    loadData()
      .then(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('items loaded')
        }
        this.setState({ loaded: true })
      })
      .catch(e => console.error(e))
  }

  renderMaintenanceRoutes() {
    return (
      <Switch>
        <Route component={MaintenancePage} path='/' />
        <Route component={Legal} path='legal' />
        <Redirect from='*' to='/' />
      </Switch>
    )
  }

  renderStandardRoutes() {
    return (
      <Switch>
        <Route component={Dashboard} path='/' exact />
        <Route component={CreateBattleReport} path='/create' exact />
        <Route component={RelatedPage} path='/related/:systemID/:time' />
        <Route component={BattleReportPage} path='/br/:brID' />
        <Route component={Legal} path='/legal' />
        <Redirect from='*' to='/' />
      </Switch>
    )
  }

  renderContent() {
    const { loaded } = this.state
    if (!loaded) {
      return <Spinner />
    }

    if (MAINTENANCE) {
      return this.renderMaintenanceRoutes()
    }

    return this.renderStandardRoutes()
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={routerHistory}>
          {this.renderContent()}
        </Router>
      </Provider>
    )
  }

}

export default hot(App)
