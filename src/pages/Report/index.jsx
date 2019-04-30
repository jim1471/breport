import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spinner } from 'components'
import Team from '../Team/Team'
import TeamStats from '../Team/TeamStats'
import TeamGrouped from '../Team/TeamGrouped'
import styles from './styles.scss'


class RelatedReport extends Component {

  render() {
    const {
      isLoading, names, teams, currTab,
      teamsInvolved, teamsShips, teamsStats,
    } = this.props

    if (!teams) return null

    if (isLoading) {
      return <Spinner />
    }

    const TeamView = currTab === 'summary' ? TeamGrouped : Team

    return (
      <div className={styles.reportRoot}>
        <div className={styles.scrollContainer}>

          <div className={styles.teamsRoot}>
            <div className={styles.autogrowSpace} />
            {teams.map((team, ix) => (
              <TeamStats
                index={ix}
                team={team}
                names={names}
                data={teamsShips[ix]}
                involved={teamsInvolved[ix]}
                teamStats={teamsStats[ix]}
                key={`teamstat-${ix}`}
              />
            ))}
            <div className={styles.autogrowSpace} />
          </div>

          <div className={styles.teamsRoot}>
            <div className={styles.autogrowSpace} />
            {teams.map((team, ix) => (
              <TeamView
                index={ix}
                team={team}
                names={names}
                data={teamsShips[ix]}
                involved={teamsInvolved[ix]}
                teamStats={teamsStats[ix]}
                key={`team-${ix}`}
              />
            ))}
            <div className={styles.autogrowSpace} />
          </div>

        </div>
      </div>
    )
  }

}

const mapDispatchToProps = {}
const mapStateToProps = ({ related, names, tabs }) => ({
  names: names.involvedNames,
  relateds: related.relateds,
  teams: related.teams,
  teamsInvolved: related.teamsInvolved,
  teamsShips: related.teamsShips,
  teamsStats: related.teamsStats,
  systemStats: related.systemStats,
  currTab: tabs.currTab,
})

const ConnectedReport = connect(mapStateToProps, mapDispatchToProps)(RelatedReport)

export default ConnectedReport
