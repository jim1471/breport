/* eslint react/jsx-no-bind: 0 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon'
import AllyIcon from 'icons/AllyIcon'
import { moveToTeam } from 'reducers/br'
import styles from './styles.scss'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

class TeamStats extends Component {

  renderTeam() {
    const { team, names, index, teamStats } = this.props
    return (
      <div className={styles.members}>
        {team.map(allyID => {
          let name = names.allys[allyID]
          let corpID = null
          if (allyID.startsWith('corp:')) {
            corpID = allyID.replace('corp:', '')
            name = names.corps[corpID]
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
      </div>
    )
  }

  renderStats() {
    const { totalLossValue, lossCount } = this.props.teamStats
    const lValue = `${numeral(totalLossValue).format('0.00a')} isk lost`
    const lCount = lossCount ? `, ${lossCount} ships lost` : ''
    return (
      <div className={styles.stats}>
        {`${lValue}${lCount}`}
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
