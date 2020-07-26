import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import { Spinner } from 'components'
// import { Tabs, Tab, Button } from 'components/common/blueprint'
import AllyIcon from 'icons/AllyIcon'
import ItemIcon from 'icons/ItemIcon'
import { SYSTEMS_DATA } from 'data/constants'
import {
  parseZkillDatetime, formatSum, shortTimeAgo,
  getDurationStr, formatPeriod,
} from 'utils/FormatUtils'
import RelatedService from 'api/RelatedService'
import styles from './styles.scss'

function RecentBrs() {
  const [recentLoading, setLoading] = useState(false)
  const [relateds, setRelateds] = useState(null)

  function fetchRecentBrs() {
    setRelateds(null)
    setLoading(true)

    RelatedService.getRecentBattleReports()
      .then(({ data }) => {
        setRelateds(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecentBrs()
  }, [])

  function getSystemName(systemID) {
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return `${system[0]} (${region})`
  }

  function renderTiming(timing) {
    if (!timing.systemID) {
      const { relatedKey } = timing
      const [systemID] = relatedKey.split('/')
      return (
        <div key={timing.relatedKey} className={styles.item}>
          <div className={cx(styles.systemCell, styles.column)}>
            {getSystemName(systemID)}
          </div>
        </div>
      )
    }

    return (
      <div key={timing.systemID} className={styles.item}>
        <div className={cx(styles.systemCell, styles.column)}>
          {getSystemName(timing.systemID)}
        </div>
      </div>
    )
  }

  function renderAllys(item) {
    if (!item.allys) return null

    return (
      <div className={styles.invRow}>
        {item.allys.map(([ally, pilots]) => {
          const corp = ally.startsWith('corp:') ? ally.replace('corp:', '') : null
          return (
            <span key={ally} className={styles.inv}>
              <AllyIcon mini={false} allyID={corp ? '' : ally} corpID={corp} />
              <span>{pilots}</span>
            </span>
          )
        })}
      </div>
    )
  }

  function renderShips(item) {
    if (!item.ships) return null

    return (
      <div className={styles.invRow}>
        {item.ships.map(([ship, count]) => (
          <span key={ship} className={styles.inv}>
            <ItemIcon id={ship} mini={false} />
            <span>{count}</span>
          </span>
        ))}
      </div>
    )
  }

  function renderZkillTime(item) {
    const { relatedKey } = item.timings[0]
    const [, zkillDatetime] = relatedKey.split('/')
    const relatedDate = parseZkillDatetime(zkillDatetime)
    const relatedDateFmt = relatedDate.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    const timeAgo = shortTimeAgo(relatedDate)

    return (
      <React.Fragment>
        <div>{relatedDateFmt}</div>
        <div>{timeAgo}</div>
        <div style={{ color: 'grey' }}>from Zkill</div>
      </React.Fragment>
    )
  }

  function renderBrTime(item) {
    const { start, end } = item.timings[0]
    const duration = getDurationStr(start, end)
    const time = formatPeriod(start, end)
    const timeAgo = shortTimeAgo(new Date(end * 1000))

    return (
      <React.Fragment>
        <div>{time}</div>
        <div>{timeAgo}</div>
        <div style={{ color: 'grey' }}>{`duration: ${duration}`}</div>
      </React.Fragment>
    )
  }

  function renderRecentBr(item) {
    return (
      <Link to={`/br/${item._id}`} key={item._id}>
        <div className={styles.row}>
          <div style={{ flexBasis: '20%', textAlign: 'left' }}>
            {item.new
              ? renderBrTime(item)
              : renderZkillTime(item)
            }
          </div>
          <div style={{ flexBasis: '20%', textAlign: 'left' }}>
            <div>{formatSum(item.totalLost)} destroyed</div>
            <div className={styles.nowrap}>
              {`${item.totalPilots} pilots, ${item.kmsCount} kms`}
            </div>
            <div>views: {item.viewed}</div>
          </div>
          <div style={{ flexBasis: '25%', textAlign: 'left' }}>
            {item.timings.map(timing => renderTiming(timing))}
          </div>
          <div style={{ flexBasis: '35%' }} className={styles.involvedCell}>
            {renderAllys(item)}
            {renderShips(item)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className={styles.recent}>
      {recentLoading &&
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      }
      {!recentLoading && relateds &&
        <React.Fragment>
          <div className={styles.table}>
            <div className={styles.head}>
              <div className={styles.headCell} style={{ flexBasis: '20%' }}>
                Time
              </div>
              <div className={styles.headCell} style={{ flexBasis: '20%' }}>
                Stats
              </div>
              <div className={styles.headCell} style={{ flexBasis: '25%' }}>
                Systems
              </div>
              <div className={cx(styles.headCell, styles.flexEnd)} style={{ flexBasis: '35%' }}>
                Involved
              </div>
            </div>
            <div className={styles.body}>
              {relateds.map(item => renderRecentBr(item))}
            </div>
          </div>
        </React.Fragment>
      }
    </div>
  )
}

export default RecentBrs
