import React from 'react'

import BrRelatedInfo from './BrRelatedInfo'
import styles from './styles.scss'

function BrPrepareInfo({ relateds, onRemove }) {
  if (!relateds || relateds.length === 0) return null

  function handleRemove(systemID) {
    onRemove({ systemID })
  }

  return (
    <div className={styles.root}>
      {relateds.map(brData => (
        <BrRelatedInfo
          {...brData}
          key={brData.systemID}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}

export default BrPrepareInfo
