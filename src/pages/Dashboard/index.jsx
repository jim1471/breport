import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import { Button, Icon } from 'components/common/blueprint'
import { Footer } from 'widgets'

import RecentZkill from './RecentZkill'
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

          <RecentZkill />

          <Footer />
        </div>
      </div>
    )
  }

}

export default hot(Dashboard)
