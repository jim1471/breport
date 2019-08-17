/* eslint react/jsx-no-bind: 0 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { Icon } from 'components/common/blueprint'
import AllyIcon from 'icons/AllyIcon'
import { moveToTeam } from 'reducers/related'
import styles from './styles.scss'

const MAX_EXPANDED_SIZE = 10
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

class TeamStats extends Component {

  renderTeam() {
    const { team, names, index, teamStats, collapsed, onExpand } = this.props
    const isReallyCollapsed = collapsed && team.length > MAX_EXPANDED_SIZE
    const currTeam = isReallyCollapsed
      ? team.slice(0, MAX_EXPANDED_SIZE - 1)
      : team

    return (
      <div className={styles.members}>
        {currTeam.map(allyID => {
          let name = names.allys[allyID] || allyID
          let corpID = null
          if (allyID.startsWith('corp:')) {
            corpID = allyID.replace('corp:', '')
            name = names.corps[corpID] || allyID
          }
          const involvedCount = teamStats.membersCount[allyID]
          // TODO: how to separate "MTU-losses" and "incorrect assign of team"
          // if (involvedCount === 0) {
          //   if (process.env.NODE_ENV === 'development') console.log('ZERO involvedCount', allyID)
          //   return null
          // }
          return (
            <div className={styles.member} key={`${allyID}-${corpID}`}>
              <Icon
                onClick={() => this.props.moveToTeam(index, index - 1, allyID)}
                className={styles.moveBtn}
                icon='double-chevron-left'
                iconSize={16}
              />
              <div className={styles.name}>
                <AllyIcon mini allyID={corpID ? '' : allyID} corpID={corpID} names={names} />
                &nbsp;
                ({involvedCount})
                &nbsp;
                {name}
              </div>
              <Icon
                onClick={() => this.props.moveToTeam(index, index + 1, allyID)}
                className={styles.moveBtn}
                icon='double-chevron-right'
                iconSize={16}
              />
            </div>
          )
        })}
        {isReallyCollapsed &&
          <div className={styles.btnExpand} onClick={onExpand}>...</div>
        }
      </div>
    )
  }

  renderStats() {
    const { totalLossValue, lossCount, totalDmg, efficiency } = this.props.teamStats
    return (
      <div className={styles.stats}>
        <div className={styles.statsRow}>
          <span>ISK Lost:</span>
          <span>{numeral(totalLossValue).format('0.00a')}</span>
        </div>
        <div className={styles.statsRow}>
          <span>Ships Lost:</span>
          <span>{`${lossCount} ships`}</span>
        </div>
        <div className={styles.statsRow}>
          <span>Inflicted Damage:</span>
          <span>{numeral(totalDmg).format('0.00a')}</span>
        </div>
        <div className={styles.statsRow}>
          <span>Efficiency:</span>
          <span>{efficiency}</span>
        </div>
      </div>
    )
  }

  render() {
    const { index, teamStats } = this.props
    const { pilotsCount } = teamStats
    return (
      <div className={styles.team}>
        <h4>Team {LETTERS[index]} ({pilotsCount})</h4>
        {this.renderTeam()}
        <div className={styles.emptySpace} />
        {this.renderStats()}
      </div>
    )
  }
}

export default connect(null, { moveToTeam })(TeamStats)
