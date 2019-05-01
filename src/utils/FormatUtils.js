/* eslint react/jsx-filename-extension: off */
// import React from 'react'
import numeral from 'numeral'

const oneBillion = 1000000000
const oneMillion = 1000000

export const formatSum = sum => {
  if (sum === 0 || !sum) {
    return '0'
  }
  const result = numeral(sum)
  if (sum >= oneBillion) {
    return result.format('0.00a')
    // return (
    //   <b>{result.format('0.00a')}</b>
    // )
  }
  return result.format('0a')
}

export const formatDmg = dmg => {
  if (dmg === 0 || !dmg) {
    return '0'
  }
  const result = numeral(dmg)
  if (dmg >= oneMillion) {
    return result.format('0.00a')
    // return (
    //   <b>{result.format('0.00a')}</b>
    // )
  }
  if (dmg < 10000) {
    return dmg // result.format('0a')
  }
  return result.format('0.0a')
}

export const dmgPercent = dmg => (
  dmg === 0 || !dmg
    ? ''
    : `(${numeral(dmg).format('0,0.0%')})`
)

export const dmgPercentZero = dmg => (
  dmg === 0 || !dmg
    ? '(0%)'
    : `(${numeral(dmg).format('0,0.0%')})`
)

export const cntWhored = cnt => (
  cnt === 0 || !cnt ? '' : ` [${cnt}]`
)

export const cntWhoredZero = cnt => (
  cnt === 0 || !cnt ? '[0]' : ` [${cnt}]`
)

const getMinutes = minutes => {
  if (minutes < 10) return `0${minutes}`
  return minutes
}

export const getLocalTime = date => {
  let result = ''
  result += `${date.getHours()}`
  result += `:${getMinutes(date.getMinutes())}`
  return result
}

export const getUTCTime = date => {
  let result = ''
  result += `${date.getUTCHours()}`
  result += `:${getMinutes(date.getUTCMinutes())}`
  return result
}
