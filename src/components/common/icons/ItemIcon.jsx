import React from 'react'
import cx from 'classnames'
import styles from './styles.scss'

const quality = 64 // 32

const ItemIcon = ({ id, mini }) => {
  let icon
  if (!id) {
    icon = (
      <img
        className={styles.itemIcon}
        alt='typeID-undefined-ship'
        src='/icons/eve-question.png'
      />
    )
  } else {
    icon = (
      <img
        className={styles.itemIcon}
        alt={`typeID-${id}`}
        src={`https://images.evetech.net/types/${id}/icon?size=${quality}`}
      />
    )
  }

  return (
    <div className={cx(styles.itemIconCont, mini && styles.mini)}>
      {icon}
    </div>
  )
}

export default ItemIcon
