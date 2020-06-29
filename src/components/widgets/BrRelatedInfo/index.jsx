import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import cx from 'classnames'
import isEmpty from 'lodash/isEmpty'

import RelatedService from 'api/RelatedService'
import { Button } from 'components/common/blueprint'
import { SYSTEMS_DATA } from 'data/constants'
import * as StatsUtils from 'utils/StatsUtils'
import { getUTCTime, formatSum, getDurationStr } from 'utils/FormatUtils'
import styles from './styles.scss'

function BrRelatedInfo({ systemID, start, end, onRemove, brPage, ...rest }) {
  const initialStats = isEmpty(rest) ? null : rest
  const [generalStats, setGeneralStats] = useState(initialStats)
  const [statsLoading, setStatsLoading] = useState(false)

  function getDotlanLink(region, systemName) {
    const encodedRegion = region.replace(' ', '_')
    return `http://evemaps.dotlan.net/map/${encodedRegion}/${systemName}`
  }

  function handleRemove() {
    onRemove(systemID)
  }

  function checkRelated() {
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
        {!brPage &&
          <div>{`${formatDistanceToNow(dateStart)} ago`}</div>
        }
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

        {!generalStats &&
          <Button
            small
            text='Check'
            onClick={checkRelated}
            intent='primary'
            loading={statsLoading}
          />
        }
      </div>

      {renderStartEndTime(start * 1000, end * 1000)}

      {onRemove &&
        <div className={styles.removeBtn}>
          <Button small icon='small-cross' intent='danger' onClick={handleRemove} />
        </div>
      }
    </div>
  )
}

export default BrRelatedInfo
