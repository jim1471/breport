import { hot } from 'react-hot-loader'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Spinner } from 'components'
import TeamStats from '../Team/TeamStats'
import TeamInvolved from '../Team/TeamInvolved'
import TeamSummary from '../Team/TeamSummary'
import TeamTimeline from '../Team/TeamTimeline'
import TeamDamage from '../Team/TeamDamage'
import TeamComposition from '../Team/TeamComposition'
import styles from './styles.scss'


class Report extends Component {

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
      case 'composition':
        return TeamComposition
      default:
        return TeamInvolved
    }
  }

  handleExpand = () => {
    this.setState({ teamStatsCollapsed: false })
  }

  handleCollapse = () => {
    this.setState({ teamStatsCollapsed: true })
  }

  render() {
    const {
      isLoading, names, teams, settings, currTab,
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
              <Fragment key={`teamstat-${ix}`}>
                <TeamStats
                  index={ix}
                  team={team}
                  names={names}
                  data={teamsShips[ix]}
                  involved={teamsInvolved[ix]}
                  teamStats={teamsStats[ix]}
                  collapsed={teamStatsCollapsed}
                  onExpand={this.handleExpand}
                  onCollapse={this.handleCollapse}
                />
                {ix < teams.length - 1 &&
                  <div className={cx(styles.autogrowSpace, styles.between)} />
                }
              </Fragment>
            ))}
            <div className={styles.autogrowSpace} />
          </div>

          <div className={styles.teamsRoot}>
            <div className={styles.autogrowSpace} />
            {teams.map((team, ix) => (
              <Fragment key={`team-${ix}`}>
                <TeamView
                  index={ix}
                  team={team}
                  names={names}
                  data={teamsShips[ix]}
                  involved={teamsInvolved[ix]}
                  teamStats={teamsStats[ix]}
                  teamLosses={teamsLosses[ix]}
                  kmData={kmData}
                  settings={settings}
                  currTab={currTab}
                />
                {ix < teams.length - 1 &&
                  <div className={cx(styles.autogrowSpace, styles.between)} />
                }
              </Fragment>
            ))}
            <div className={styles.autogrowSpace} />
          </div>

        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}
const mapStateToProps = ({ related, names, tabs, settings }) => ({
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
  settings,
})

const ConnectedReport = connect(mapStateToProps, mapDispatchToProps)(Report)

export default hot(module)(ConnectedReport)
