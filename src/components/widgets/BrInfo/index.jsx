import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import cn from 'classnames'

import RelatedService from 'api/RelatedService'
import { Button } from 'components/common/blueprint'
import { SYSTEMS_DATA } from 'data/constants'
import { getUTCTime, formatSum, getDurationStr } from 'utils/FormatUtils'
import styles from './styles.scss'

class BrInfo extends Component {

  getDotlanLink(region, systemName) {
    const encodedRegion = region.replace(' ', '_')
    return `http://evemaps.dotlan.net/map/${encodedRegion}/${systemName}`
  }

  checkRel(url) {
    RelatedService.checkRelatedKillmails(url)
      .then(({ data }) => console.log('data:', data))
      .catch(err => console.error(err))
  }

  renderStartEndTime() {
    const { systemStats = {} } = this.props
    const { systemID, fromTime, toTime } = systemStats
    if (!systemID || !fromTime || !toTime) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)

    return (
      <div className={styles.timing}>
        <div>{`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}</div>
        <div>{`${formatDistanceToNow(dateStart)} ago`}</div>
      </div>
    )
  }

  renderGeneralStats() {
    const { generalStats, systemStats = {}, viewed } = this.props
    const { fromTime, toTime } = systemStats
    if (!generalStats || !fromTime || !toTime) return null
    let stats = `Total lost: ${formatSum(generalStats.totalLossValue)},`
    stats += ` Pilots: ${generalStats.pilotsCount},`
    stats += ` Viewed: ${viewed}`

    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)
    const duration = getDurationStr(dateStart, dateEnd)

    return (
      <div className={styles.generalStats}>
        <div>{stats}</div>
        <div>{`Duration: ${duration}`}</div>
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
          {this.renderGeneralStats()}
        </div>
        {this.renderStartEndTime()}

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
        {inputRelateds.map((url, ix) => {
          console.log('url:', url)
          return (
            <div key={ix}>
              <div>{url}</div>
              <br />
              <Button text='Check URL' onClick={() => this.checkRel(url)} />
            </div>
          )
        })}
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
  viewed: related.viewed,
  systemStats: related.systemStats,
  relateds: related.relateds,
  generalStats: related.generalStats,
  inputRelateds: battlereport.inputRelateds,
})

export default connect(mapStateToProps, mapDispatchToProps)(BrInfo)
