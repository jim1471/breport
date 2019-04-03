import React from 'react'

const quality = 64 // 32

const ItemIcon = ({ id }) => {
  if (!id) {
    return (
      <img
        className='img-32'
        alt='typeID-undefined-ship'
        src='https://zkillboard.com/img/eve-question.png'
      />
    )
  }

  return (
    <img
      className='img-32'
      alt={`typeID-${id}`}
      src={`https://imageserver.eveonline.com/Type/${id}_${quality}.png`}
    />
  )
}

export default ItemIcon
