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
            <div>Maintenance in progress...</div>
            <div>.</div>
            <div>DB needs some love.</div>
            <div>Will return to operational in half a hour.</div>
            <div>.</div>
            <div>Stay tuned and fly dangerous o7</div>
          </div>

          <Footer />
        </div>
      </div>
    )
  }
}
