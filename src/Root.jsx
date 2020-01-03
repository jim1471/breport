import { hot } from 'react-hot-loader'
import React from 'react'
import Loadable from 'react-loadable'
import { Switch, Route, Redirect } from 'react-router-dom'
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
  <Switch>
    <Route component={MaintenancePage} path='/' />
    <Route component={Legal} path='legal' />
    <Redirect from='*' to='/' />
  </Switch>
)

const standardRoutes = () => (
  <Switch>
    <Route component={Dashboard} path='/' exact />
    <Route component={RelatedPage} path='/related/:systemID/:time' />
    <Route component={BattleReportPage} path='/br/:brID' />
    <Route component={Legal} path='/legal' />
    <Redirect from='*' to='/' />
  </Switch>
)

const Root = () => (
  <App>
    {MAINTENANCE
      ? maintenanceRoutes()
      : standardRoutes()
    }
  </App>
)

export default hot(module)(Root)
