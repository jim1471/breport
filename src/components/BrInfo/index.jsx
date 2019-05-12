import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { SYSTEMS_DATA } from 'data/constants'
import { getUTCTime, formatSum } from 'utils/FormatUtils'
import styles from './styles.scss'

class BrInfo extends Component {

  getDotlanLink(region, systemName) {
    const encodedRegion = region.replace(' ', '_')
    return `http://evemaps.dotlan.net/map/${encodedRegion}/${systemName}`
  }

  renderStartEndTime() {
    const { systemStats = {} } = this.props
    const { systemID, fromTime, toTime } = systemStats
    if (!systemID) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)
    return (
      <div className={styles.timing}>
        {`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}
      </div>
    )
  }

  renderGeneralStats() {
    const { generalStats } = this.props
    if (!generalStats) {
      return null
    }
    return (
      <div className={styles.generalStats}>
        {`Total lost: ${formatSum(generalStats.totalLossValue)}, Pilots: ${generalStats.pilotsCount}`}
      </div>
    )
  }

  render() {
    if (!SYSTEMS_DATA.systems) {
      return null
    }
    const { routerParams, relateds } = this.props
    let { systemID, time } = routerParams
    if (!systemID) {
      if (relateds && relateds[0]) {
        [systemID, time] = relateds[0].relatedKey.split('/')
      } else {
        return null
      }
    }

    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    const systemName = system && system[0]
    const { relatedKey } = (relateds[0] || {})

    return (
      <div className={styles.systemStats}>
        <div className={styles.title}>
          <span className={styles.systemName}>
            <a href={this.getDotlanLink(region, systemName)} target='_blank' rel='noopener noreferrer'>
              {`${systemName}`}
            </a>
            <small>{`(${region})`}</small>
            <small>
              <a href={`http://zkillboard.com/related/${systemID}/${time}/`} target='_blank' rel='noopener noreferrer'>
                zkillboard
              </a>
            </small>
          </span>

          {process.env.NODE_ENV === 'development' && relatedKey &&
            <small>
              &nbsp;
              <Link to={`/related/${relatedKey}`}>link to related</Link>
            </small>
          }
          {this.renderStartEndTime()}
        </div>
        {this.renderGeneralStats()}
      </div>
    )
  }
}

const mapDispatchToProps = {}
const mapStateToProps = ({ related }) => ({
  systemStats: related.systemStats,
  relateds: related.relateds,
  generalStats: related.generalStats,
})

export default connect(mapStateToProps, mapDispatchToProps)(BrInfo)
