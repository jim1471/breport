import { hot } from 'react-hot-loader'
import React from 'react'
import Loadable from 'react-loadable'
import { browserHistory, Router, Route, IndexRoute, Redirect } from 'react-router'
import { Spinner } from 'components'
import MaintenancePage from 'pages/Dashboard/MaintenancePage'
import App from './App'


const MAINTENANCE = false


const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "Dashboard" */'pages/Dashboard'),
  loading: () => <Spinner />,
})

const RelatedPage = Loadable({
  loader: () => import(/* webpackChunkName: "RelatedPage" */'pages/RelatedPage'),
  loading: () => <Spinner />,
})

const BattleReportPage = Loadable({
  loader: () => import(/* webpackChunkName: "BattleReportPage" */'pages/BattleReportPage'),
  loading: () => <Spinner />,
})

const Legal = Loadable({
  loader: () => import(/* webpackChunkName: "Legal" */'pages/Legal'),
  loading: () => <Spinner />,
})

const maintenanceRoutes = () => (
  <Route component={App}>
    <Route component={MaintenancePage} path='/' />
    <Route component={Legal} path='legal' />
    <Redirect from='*' to='/' />
  </Route>
)

const routes = () => (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />

    <Route component={RelatedPage} path='related/:systemID/:time' />

    <Route component={BattleReportPage} path='br/:brID' />

    <Route component={Legal} path='legal' />

    <Redirect from='*' to='/' />
  </Route>
)

const RouterBridge = () => (
  <Router history={browserHistory}>
    {MAINTENANCE
      ? maintenanceRoutes()
      : routes()
    }
  </Router>
)


export default hot(module)(RouterBridge)
