import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spinner } from 'components'
import TeamStats from '../Team/TeamStats'
import TeamInvolved from '../Team/TeamInvolved'
import TeamSummary from '../Team/TeamSummary'
import TeamTimeline from '../Team/TeamTimeline'
import TeamDamage from '../Team/TeamDamage'
import styles from './styles.scss'


class Report extends Component {

  // example - /br/5cd5d7184a724f00173d85b9
  state = {
    teamStatsCollapsed: true,
  }

  getTeamComponent() {
    const { currTab } = this.props
    switch (currTab) {
      case 'summary':
        return TeamSummary
      case 'timeline':
        return TeamTimeline
      case 'damage':
        return TeamDamage
      default:
        return TeamInvolved
    }
  }

  handleExpand = () => {
    this.setState({ teamStatsCollapsed: false })
  }

  render() {
    const {
      isLoading, names, teams,
      teamsInvolved, teamsShips, teamsStats, teamsLosses, kmData,
    } = this.props
    const { teamStatsCollapsed } = this.state

    if (!teams || isLoading) {
      return <Spinner />
    }

    const TeamView = this.getTeamComponent()

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
                collapsed={teamStatsCollapsed}
                onExpand={this.handleExpand}
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
                teamLosses={teamsLosses[ix]}
                kmData={kmData}
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
  kmData: related.kmData,
  teams: related.teams,
  teamsInvolved: related.teamsInvolved,
  teamsShips: related.teamsShips,
  teamsStats: related.teamsStats,
  teamsLosses: related.teamsLosses,
  systemStats: related.systemStats,
  currTab: tabs.currTab,
})

const ConnectedReport = connect(mapStateToProps, mapDispatchToProps)(Report)

export default ConnectedReport
