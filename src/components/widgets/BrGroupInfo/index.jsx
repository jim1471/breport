import React, { useState } from 'react'
import cx from 'classnames'

import { Button, Icon } from 'components/common/blueprint'
import BrRelatedInfo from 'widgets/BrRelatedInfo'
import styles from './styles.scss'

function BrGroupInfo({ relateds }) {
  if (!relateds || relateds.length === 0) return null

  const [grouped, setGrouped] = useState(true)

  if (grouped && relateds.length > 1) {
    const overallStats = relateds.reduce((stats, next) => {
      stats.systems.push(next.systemID)
      stats.kmsCount += next.kmsCount
      stats.pilotsCount += next.pilotsCount
      stats.totalLossValue += next.totalLossValue
      if (next.start < stats.start) {
        stats.start = next.start
      }
      if (next.end > stats.end) {
        stats.end = next.end
      }
      return stats
    }, {
      systems: [],
      kmsCount: 0,
      pilotsCount: 0,
      totalLossValue: 0,
      start: relateds[0].start,
      end: relateds[0].end,
    })

    return (
      <div className={cx('bp3-dark', styles.brInfoRoot)}>
        <BrRelatedInfo
          {...overallStats}
          brPage
        />
        <div className={styles.detailsBtn}>
          <Button
            small
            icon='list-detail-view'
            onClick={() => setGrouped(false)} // eslint-disable-line
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.brInfoRoot}>
      {relateds.map(relData => (
        <BrRelatedInfo
          {...relData}
          key={relData.systemID}
          brPage
        />
      ))}
      {relateds.length > 1 &&
        <div className={styles.btnCollapse} onClick={() => setGrouped(true)}>
          <Icon iconSize={16} icon='double-chevron-up' />
          &nbsp;
          Collapse to General Statistics
        </div>
      }
    </div>
  )
}

export default React.memo(BrGroupInfo)
