import { hot } from 'react-hot-loader'
import React from 'react'
import { browserHistory, Router, Route, IndexRoute, Redirect } from 'react-router'
import RelatedPage from 'pages/RelatedPage'
import BattleReportPage from 'pages/BattleReportPage'
import Dashboard from 'pages/Dashboard'
import Legal from 'pages/Legal'
import App from './App'


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
    {routes()}
  </Router>
)


export default hot(module)(RouterBridge)
