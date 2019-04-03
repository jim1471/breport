import { hot } from 'react-hot-loader'
import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import RelatedPage from 'pages/RelatedPage'
import Dashboard from 'pages/Dashboard'
import App from './App'


const NotFound = () => (
  <div style={{ margin: 30, fontSize: 32 }}>
    <div>400</div>
    <div>PAGE NOT FOUND</div>
  </div>
)


const routes = () => (
  <Route path='/'>

    <Route component={RelatedPage} path='related/:systemID/:time' />

    <Route component={App}>
      <IndexRoute component={Dashboard} />
    </Route>

    <Route component={NotFound} path='*' />
  </Route>
)


const RouterBridge = () => (
  <Router history={browserHistory}>
    {routes()}
  </Router>
)


export default hot(module)(RouterBridge)
