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
    return '0'
  }
  const result = numeral(dmg)
  if (dmg >= oneMillion) {
    return (
      <b>{result.format('0.00a')}</b>
    )
  }
  if (dmg < 10000) {
    return dmg // result.format('0a')
  }
  return result.format('0.0a')
}

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

export const localStorageSpace = () => {
  let data = ''
  console.log('Current local storage: ')
  for (const key in window.localStorage) { // eslint-disable-line
    if (window.localStorage.hasOwnProperty(key)) { // eslint-disable-line
      data += window.localStorage[key]
      const size = ((window.localStorage[key].length * 16) / (8 * 1024)).toFixed(2)
      console.log(`  ${key}: ${size} KB`)
    }
  }
  const totalSize = ((data.length * 16) / (8 * 1024)).toFixed(2)
  console.log(data ? `Total space used: ${totalSize} KB` : 'Empty (0 KB)')
  console.log(data ? `Approx. space remaining: ${5120 - totalSize} KB` : '5 MB')
}
