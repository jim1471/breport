import { hot } from 'react-hot-loader'
import React from 'react'
import { browserHistory, Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router'
import RelatedPage from 'pages/RelatedPage'
import BattleReportPage from 'pages/BattleReportPage'
import Dashboard from 'pages/Dashboard'
import App from './App'


const routes = () => (
  <Route path='/'>
    <IndexRedirect to='/br/5cb7a1bca236fcd1190f23e0' />

    <Route component={RelatedPage} path='related/:systemID/:time' />

    <Route component={BattleReportPage} path='br/:brID' />

    <Route component={App}>
      <IndexRoute component={Dashboard} />
    </Route>

    <Redirect from='*' to='/' />
  </Route>
)


const RouterBridge = () => (
  <Router history={browserHistory}>
    {routes()}
  </Router>
)


export default hot(module)(RouterBridge)
