import React, { Component } from 'react'
import { Footer } from 'widgets'
import styles from './styles.scss'

export default class MaintenancePage extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool is for generating battle reports from killmails held on zKillboard.com.</h4>

          <div className={styles.maintenanceRoot}>
            <div>Maintenance</div>
            <a href='https://status.heroku.com/'>
              {`https://status.heroku.com/`}
            </a>
          </div>

          <Footer />
        </div>
      </div>
    )
  }
}
