import React from 'react'

import { SYSTEMS_DATA } from 'data/constants'
import styles from './styles.scss'

function getDotlanLink(region, system) {
  const encodedRegion = region.replace(' ', '_')
  return `http://evemaps.dotlan.net/map/${encodedRegion}/${system}`
}

function getSystemName(systemID) {
  const relSystemID = systemID - 30000000
  const sysObj = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
  const region = sysObj && SYSTEMS_DATA.regions[sysObj[2]]
  const systemName = sysObj && sysObj[0]

  return [systemName, region]
}

function SystemName({ systemID, systems }) {
  if (!systemID && Array.isArray(systems)) {

    return (
      <span className={styles.systemName}>
        {systems.map((id, ix) => {
          const [systemName, region] = getSystemName(id)
          return (
            <span className={styles.item} key={id}>
              <a href={getDotlanLink(region, systemName)} target='_blank' rel='noopener noreferrer'>
                {`${systemName}`}
              </a>
              {ix < systems.length - 1 &&
                <span>,</span>
              }
              {false && <small>{`(${region})`}</small>}
            </span>
          )
        })}
      </span>
    )
  }

  const [systemName, region] = getSystemName(systemID)

  return (
    <span className={styles.systemName}>
      <a href={getDotlanLink(region, systemName)} target='_blank' rel='noopener noreferrer'>
        {`${systemName}`}
      </a>
      <small>{`(${region})`}</small>
    </span>
  )
}

export default React.memo(SystemName)
