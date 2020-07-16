import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

import { Spinner } from 'components'
import { Tabs, Tab } from 'components/common/blueprint'
import { SYSTEMS_DATA } from 'data/constants'
import { parseZkillDatetime, formatSum } from 'utils/FormatUtils'
import RelatedService from 'api/RelatedService'
import styles from './styles.scss'


function RecentZkill() {
  const [currTab, setCurrTab] = useState('recent')
  const [recentLoading, setLoading] = useState(true)
  const [relateds, setRelateds] = useState(null)

  function getRecentPromise() {
    switch (currTab) {
      case 'big':
        return RelatedService.getRecentRelatedsBig()
      case 'huge':
        return RelatedService.getRecentRelatedsHuge()
      case 'added':
        return RelatedService.getRecentlyAddedRelateds()
      case 'recent':
      default:
        return RelatedService.getRecentRelateds()
    }
  }

  function fetchRecentRelateds() {
    setRelateds(null)
    setLoading(true)

    getRecentPromise()
      .then(({ data }) => {
        setRelateds(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecentRelateds()
  }, [currTab])

  function handleTabChange(nextTab) {
    setCurrTab(nextTab)
  }

  function getSystemName(systemID) {
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    if (!system) {
      return 'unknown'
    }
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return `${system[0]} (${region})`
  }

  function renderRecentRelated(item) {
    const key = `${item.systemID}/${item.datetime}`
    const path = `/related/${key}`
    const createdAt = new Date(item.createdAt)
    const relatedDate = parseZkillDatetime(item.datetime)
    const relatedDateFmt = relatedDate && relatedDate.toUTCString()
      .replace(':00:00', ':00').replace(':30:00', ':30').replace('GMT', 'ET')

    return (
      <div key={key} className={styles.item}>
        <div className={cx(styles.systemCell, styles.column)}>
          <Link to={path}>
            {getSystemName(item.systemID)}
          </Link>
          <div>{relatedDateFmt}</div>
        </div>
        <div className={styles.systemCell}>
          <div className={styles.distanceCell}>
            {`${formatDistanceToNow(relatedDate)} ago`}
          </div>
          <div className={styles.createdAt}>
            <span className={styles.createdAtLabel}>added </span>
            <span>{`${formatDistanceToNow(createdAt)} ago`}</span>
          </div>
        </div>
        <div className={styles.systemCell}>
          <div className={styles.statsCell}>
            <span>{`Total lost: ${formatSum(item.totalLost) || '?'},`}</span>
            <span>{`Killmails: ${item.kmsCount},`}</span>
            <span>{`Pilots: ${item.totalPilots},`}</span>
            <span>{`Viewed: ${item.viewed}`}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.recent}>
      <Tabs
        id='recent'
        selectedTabId={currTab}
        onChange={handleTabChange}
        animate={false}
      >
        <Tab id='recent' title='Recent Reports' />
        <Tab id='big' title='Recent >10kkk' />
        <Tab id='huge' title='Recent >100kkk' />
        <Tab id='added' title='Recently Added' />
      </Tabs>
      {recentLoading &&
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      }
      {relateds &&
        relateds.map(item => renderRecentRelated(item))
      }
    </div>
  )
}

export default RecentZkill
