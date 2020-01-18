import React, { Component } from 'react'
import InvolvedRow from 'components/InvolvedRow'
import styles from './styles.scss'


class TeamInvolved extends Component {

  renderHeader() {
    return (
      <div className={styles.head}>
        <div className={styles.body}>
          <div className={styles.row}>
            <span style={{ color: 'gold' }}>Pilot</span>
            <span style={{ color: 'gold' }}>used ships | loss value</span>
          </div>
          <div className={styles.row}>
            <span>Ship</span>
            <span>Dmg [Kills]</span>
          </div>
        </div>
        <div className={styles.corp}>Corp</div>
        <div className={styles.ally}>Ally</div>
      </div>
    )
  }

  render() {
    const { data, names, teamStats, settings } = this.props
    const { totalDmg, maxDmg, maxCnt } = teamStats

    if (!data) {
      console.error('undefined data:', data)
      return null
    }

    let shipsData = data
    if (process.env.NODE_ENV === 'development') {
      shipsData = data
      // shipsData = data.slice(0, 20)
    }

    return (
      <div className={styles.team}>
        {this.renderHeader()}
        {shipsData.map(ship => {
          const shipKey = `${ship.charID}-${ship.id}`
          return (
            <InvolvedRow
              key={shipKey}
              data={ship}
              totalDmg={totalDmg}
              maxDmg={maxDmg}
              maxCnt={maxCnt}
              names={names}
              showExtendedStatistics={settings.showExtendedStatistics}
            />
          )
        })}
      </div>
    )
  }
}

export default TeamInvolved
