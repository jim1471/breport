import { hot } from 'react-hot-loader'
import React from 'react'
import loadable from '@loadable/component'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Spinner } from 'components'
import MaintenancePage from 'pages/Dashboard/MaintenancePage'
import App from './App'

const MAINTENANCE = true

const Dashboard = loadable(() => import(/* webpackChunkName: "Dashboard" */'pages/Dashboard'), { fallback: <Spinner /> })
const RelatedPage = loadable(() => import(/* webpackChunkName: "RelatedPage" */'pages/RelatedPage'), { fallback: <Spinner /> })
const BattleReportPage = loadable(() => import(/* webpackChunkName: "BattleReportPage" */'pages/BattleReportPage'), { fallback: <Spinner /> })
const Legal = loadable(() => import(/* webpackChunkName: "Legal" */'pages/Legal'), { fallback: <Spinner /> })


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
