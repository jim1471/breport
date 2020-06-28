import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import cx from 'classnames'

import RelatedService from 'api/RelatedService'
import { Spinner } from 'components'
import { Button } from 'components/common/blueprint'
import { SYSTEMS_DATA } from 'data/constants'
import * as StatsUtils from 'utils/StatsUtils'
import { getUTCTime, formatSum, getDurationStr } from 'utils/FormatUtils'
import styles from './styles.scss'

function BrRelatedInfo({ systemID, url, start, end, onRemove }) {
  const [generalStats, setGeneralStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  function getDotlanLink(region, systemName) {
    const encodedRegion = region.replace(' ', '_')
    return `http://evemaps.dotlan.net/map/${encodedRegion}/${systemName}`
  }

  function handleRemove() {
    onRemove(systemID)
  }

  function checkRel() {
    setStatsLoading(true)
    RelatedService.checkRelatedKillmails({ systemID, start, end })
      .then(({ data }) => {
        if (data && data.result === 'success') {
          const stats = StatsUtils.getKmsGeneralStats(data.kms)
          if (process.env.NODE_ENV === 'development') {
            console.log('stats:', stats)
          }
          setGeneralStats(stats)
        }
        setStatsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setStatsLoading(false)
      })
  }

  function renderStartEndTime(fromTime, toTime) {
    if (!fromTime || !toTime) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)
    const duration = getDurationStr(dateStart, dateEnd)

    return (
      <div className={styles.timing}>
        <div>{`Duration: ${duration}`}</div>
        <div>{`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}</div>
        <div>{`${formatDistanceToNow(dateStart)} ago`}</div>
      </div>
    )
  }

  function renderGeneralStats() {
    if (!generalStats) return null

    const { totalLossValue, pilotsCount, kmsCount } = generalStats
    let stats = `Lost: ${formatSum(totalLossValue)},`
    stats += ` Pilots: ${pilotsCount},`
    stats += ` Killmails: ${kmsCount}`

    return (
      <div className={styles.generalStats}>
        <div>{stats}</div>
      </div>
    )
  }

  const relSystemID = systemID - 30000000
  const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
  const region = system && SYSTEMS_DATA.regions[system[2]]
  const systemName = system && system[0]

  return (
    <div className={styles.systemStats} key={systemID}>
      <div className={cx(styles.title, generalStats && styles.block)}>
        <span className={styles.systemName}>
          <a href={getDotlanLink(region, systemName)} target='_blank' rel='noopener noreferrer'>
            {`${systemName}`}
          </a>
          <small>{`(${region})`}</small>
        </span>

        {generalStats && !statsLoading && renderGeneralStats()}

        {!generalStats && !statsLoading &&
          <Button small text='Check' onClick={checkRel} intent='primary' />
        }

        {statsLoading &&
          <Spinner small />
        }
      </div>

      {renderStartEndTime(start * 1000, end * 1000)}

      <div className={styles.closeBtn}>
        <Button small icon='small-cross' intent='danger' onClick={handleRemove} />
      </div>
    </div>
  )
}

export default BrRelatedInfo
