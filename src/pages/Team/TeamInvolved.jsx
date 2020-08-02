import React, { Component } from 'react'
import cx from 'classnames'
import { Button, Icon } from 'components/common/blueprint'
import InvolvedRow from 'components/InvolvedRow'
import styles from './styles.scss'

const MIN_ROWS = 100

class TeamInvolved extends Component {

  state = {
    dataLength: this.props.data.length,
    minKms: this.props.data.length > MIN_ROWS,
    expanded: this.props.settings.extraShipsExpanded,
    currSetting: this.props.settings.extraShipsExpanded,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.length !== prevState.dataLength) {
      return {
        minKms: nextProps.data.length > MIN_ROWS,
      }
    }
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

  toggleMinKms = () => {
    this.setState(state => ({ minKms: !state.minKms }))
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
          <div className={cx(styles.row, styles.gold)}>
            <span>Pilot</span>
            <span>used ships | loss value</span>
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
    const { minKms } = this.state

    if (!data) {
      console.error('undefined data:', data)
      return null
    }

    let extraRowsNum = data.length
    let shipsData = data
    if (minKms) {
      shipsData = data.slice(0, MIN_ROWS)
      extraRowsNum = data.length - MIN_ROWS
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
        {minKms &&
          <div className={styles.btnExpandRows} onClick={this.toggleMinKms}>
            <Icon iconSize={16} icon='double-chevron-down' />
            &nbsp;
            &nbsp;
            {`Expand extra ${extraRowsNum} participants`}
          </div>
        }
      </div>
    )
  }
}

export default TeamInvolved
