import React from 'react'
import styles from './styles.scss'

const quality = 64 // 32

const ItemIcon = ({ id }) => {
  let icon
  if (!id) {
    icon = (
      <img
        className={styles.itemIcon}
        alt='typeID-undefined-ship'
        src='https://zkillboard.com/img/eve-question.png'
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
    <div className={styles.itemIconCont}>
      {icon}
    </div>
  )
}

export default ItemIcon
