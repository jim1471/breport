/* eslint react/jsx-filename-extension: off */
// import React from 'react'
import numeral from 'numeral'

const oneBillion = 1000000000
const tenMillion = 10000000
const oneMillion = 1000000
const tenThousand = 10000
const oneThousand = 1000


// only three significant digits
const numberFormat = sum => {
  if (sum >= 100 * oneBillion) {
    return '0.0a'
  }
  if (sum >= 10 * oneBillion) {
    return '0.0a'
  }
  if (sum >= oneBillion) {
    return '0.00a'
  }
  if (sum >= 100 * oneMillion) {
    return '0a'
  }
  if (sum >= tenMillion) {
    return '0.0a'
  }
  if (sum >= oneMillion) {
    return '0.00a'
  }
  if (sum >= 100 * oneThousand) {
    return '0a'
  }
  if (sum >= tenThousand) {
    return '0.0a'
  }
  if (sum >= oneThousand) {
    return '0.00a'
  }
  return '0a'
}


export const formatSum = sum => {
  if (sum === 0 || !sum) {
    return '0'
  }
  return numeral(sum).format(numberFormat(sum))
}

export const formatDmg = dmg => {
  if (dmg === 0 || !dmg) {
    return '0'
  }
  return numeral(dmg).format(numberFormat(dmg))
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
  result += `:${getMinutes(date.getUTCSeconds())}`
  return result
}

export const timestampToLocal = timestamp => {
  const date = new Date(timestamp)
  return getLocalTime(date)
}

export const timestampToUTC = timestamp => {
  const date = new Date(timestamp)
  return getUTCTime(date)
}
