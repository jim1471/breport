import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import cn from 'classnames'
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
    const { generalStats, systemStats = {} } = this.props
    if (!generalStats) {
      return null
    }
    const { fromTime } = systemStats
    const dateStart = new Date(fromTime)
    if (!fromTime) {
      console.error(`systemStats.fromTime ${fromTime}`)
      return null
    }
    return (
      <div className={styles.generalStats}>
        <div>{`${formatDistanceToNow(dateStart)} ago`}</div>
        <div>{`Total lost: ${formatSum(generalStats.totalLossValue)}, Pilots: ${generalStats.pilotsCount}`}</div>
      </div>
    )
  }

  renderSingle() {
    if (!SYSTEMS_DATA.systems) {
      return null
    }
    const { routerParams = {}, relateds } = this.props
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

          {this.renderStartEndTime()}
        </div>
        {this.renderGeneralStats()}

        {relatedKey &&
          <small className={styles.related}>
            <Link to={`/related/${relatedKey}`} target='_blank' rel='noopener noreferrer'>
              link to related
            </Link>
          </small>
        }
      </div>
    )
  }

  renderInputRelateds() {
    const { inputRelateds } = this.props
    return (
      <div className={cn(styles.systemStats, styles.dashboard)}>
        {`inputRelateds: ${inputRelateds.length}`}
      </div>
    )
  }

  render() {
    const { dashboard } = this.props
    if (!dashboard) {
      return this.renderSingle()
    }
    return this.renderInputRelateds()
  }
}

const mapDispatchToProps = {}
const mapStateToProps = ({ related, battlereport }) => ({
  systemStats: related.systemStats,
  relateds: related.relateds,
  generalStats: related.generalStats,
  inputRelateds: battlereport.inputRelateds,
})

export default connect(mapStateToProps, mapDispatchToProps)(BrInfo)
