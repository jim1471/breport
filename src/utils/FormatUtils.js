/* eslint react/jsx-filename-extension: off */
import React from 'react'
import numeral from 'numeral'

const oneBillion = 1000000000
const oneMillion = 1000000

export const formatSum = sum => {
  const result = numeral(sum)
  if (sum >= oneBillion) {
    return (
      <b>{result.format('0.00a')}</b>
    )
  }
  return result.format('0a')
}

export const formatDmg = dmg => {
  if (dmg === 0 || !dmg) {
    return ''
  }
  const result = numeral(dmg)
  if (dmg >= oneMillion) {
    return result.format('0.00a')
  }
  return result.format('0.0a')
}
