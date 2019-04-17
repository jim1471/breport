import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spinner } from 'components'
import { getLocalTime, getUTCTime, localStorageSpace } from 'utils/FormatUtils'
import Team from '../Team/Team'
import TeamStats from '../Team/TeamStats'
import TeamGrouped from '../Team/TeamGrouped'
import styles from './styles.scss'

const SYSTEMS_DATA = require('utils/data/systems.json')


class RelatedReport extends Component {

  componentDidMount() {
    localStorageSpace()
  }

  renderSystemAndTime() {
    const { systemStats = {}, routerParams } = this.props
    const { systemID, fromTime, toTime } = systemStats
    if (!systemID) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    const systemName = system && system[0]

    return (
      <div className={styles.systemStats}>
        <div className={styles.title}>
          <h1>
            <small>Battle Report:</small>
            <span className={styles.systemName}>{` ${systemName} (${region}) `}</span>
            <small className={styles.zkill}>
              <a
                href={`http://zkillboard.com/related/${systemID}/${routerParams.time}/`}
                target='_blank'
                rel='noopener noreferrer'
              >

                {` zkillboard`}
              </a>
            </small>
          </h1>
        </div>
        <div>
          {`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}
          {` (${getLocalTime(dateStart)} - ${getLocalTime(dateEnd)})`}
        </div>
      </div>
    )
  }

  render() {
    const {
      isLoading, names, teams, reportType,
      teamsInvolved, teamsShips, teamsStats,
    } = this.props

    if (!teams) return null

    if (isLoading) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner size='60' />
        </div>
      )
    }

    const TeamView = reportType === 'grouped' ? TeamGrouped : Team

    return (
      <div className={styles.reportRoot}>
        {this.renderSystemAndTime()}

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

        <div className={styles.footer}>
          <div>
            <span>All EVE related materials are property of</span>
            <a href='https://www.ccpgames.com' target='_blank' rel='noopener noreferrer'>
              CCP Games
            </a>
          </div>
          <a href='https://github.com/maullerz/breport' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = {}
const mapStateToProps = ({ related }) => ({
  ...related,
  names: related.involvedNames,
  systemStats: related.systemStats,
})

const ConnectedReport = connect(mapStateToProps, mapDispatchToProps)(RelatedReport)

export default ConnectedReport
