import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom'
import cx from 'classnames'


import { Button, Icon } from 'components/common/blueprint'
import { Footer } from 'widgets'

import RecentZkill from './RecentZkill'
import RecentBrs from './RecentBrs'
import styles from './styles.scss'

class Dashboard extends Component {

  render() {
    return (
      <div className={cx('bp3-dark', styles.root)}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool is for generating battle reports from killmails held on zKillboard.com.</h4>
          <h4>
            <Icon iconSize={16} icon='issue' intent='warning' />
            &nbsp;
            Killmails presented currently only for 2020 year.
          </h4>

          <Link to='/create' className={styles.createLink}>
            <Button large text='CREATE BATTLE REPORT' />
          </Link>

          <div className={styles.recentLinks}>
            <NavLink to='/recent-brs'>
              Recent Battle Reports
            </NavLink>
            <NavLink to='/recent-zkill'>
              Recent Zkill Reports
            </NavLink>
          </div>

          <Switch>
            <Route component={RecentBrs} path='/recent-brs' exact />
            <Route component={RecentZkill} path='/recent-zkill' exact />
            <Redirect from='*' to='/recent-brs' />
          </Switch>

          <Footer />
        </div>
      </div>
    )
  }

}

export default hot(Dashboard)
