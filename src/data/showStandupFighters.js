const startsWith = require('lodash/startsWith')
const shipsInfo = require('./shipsInfo.json')

const ids = Object.keys(shipsInfo).filter(id => {
  const item = shipsInfo[id]
  return startsWith(item.name, 'Standup') && item.categoryName === 'Fighter'
})

// console.log('ids:', ids)

ids.forEach(id => {
  const item = shipsInfo[id]
  console.log(`  ${id}, // ${item.name}`)
})
