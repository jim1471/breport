import React, { Component } from 'react'
import cx from 'classnames'
import { Button } from 'components/common/blueprint'
import InvolvedRow from 'components/InvolvedRow'
import styles from './styles.scss'


class TeamInvolved extends Component {

  state = {
    expanded: this.props.settings.extraShipsExpanded,
    currSetting: this.props.settings.extraShipsExpanded,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.currSetting !== nextProps.settings.extraShipsExpanded) {
      if (prevState.expanded !== nextProps.settings.extraShipsExpanded) {
        return {
          expanded: nextProps.settings.extraShipsExpanded,
          currSetting: nextProps.settings.extraShipsExpanded,
        }
      }
    }
    return null
  }

  toggleExpanded = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  renderHeader() {
    const { expanded } = this.state
    const btnTitle = expanded
      ? 'Collapse extra ship types'
      : 'Expand extra ship types'
    const icon = expanded
      ? 'double-chevron-up'
      : 'double-chevron-down'
    return (
      <div className={cx(styles.head, 'bp3-dark')}>
        <div className={styles.extraShipsBtn}>
          <Button small icon={icon} title={btnTitle} onClick={this.toggleExpanded} />
        </div>
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
    const { data, names, teamStats, settings, currTab } = this.props
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
              currTab={currTab}
              showExtendedStatistics={settings.showExtendedStatistics}
              extraShipsExpanded={this.state.expanded}
            />
          )
        })}
      </div>
    )
  }
}

export default TeamInvolved
