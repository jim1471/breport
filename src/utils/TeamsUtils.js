
const addKey = (result, key) => {
  if (key) {
    if (result[key]) {
      result[key] += 1
    } else {
      result[key] = 1
    }
  }
}

const invalidReport = allGroups => {
  console.error('not enough or not valid data')
  console.log('could not autogenerate valid report')
  return [
    allGroups.sortedByImpact,
    [],
  ]
}

export const getAllGroups = data => {
  // All fielded allys and corps
  const allGroups = {}
  data.forEach(km => {
    // 1. from victim
    if (km.victim.ally) {
      addKey(allGroups, km.victim.ally)
    } else if (km.victim.corp) {
      // corp without alliance
      const corpID = `corp:${km.victim.corp}`
      addKey(allGroups, corpID)
    } else {
      // its just NPC entities - Angel Heavy Missile Battery etc
      // console.warn('victim without ally and corp:', km.killmail_id, km.victim) // eslint-disable-line
    }
    // 2. from attackers
    km.attackers.forEach(att => {
      if (att.ally) {
        addKey(allGroups, att.ally)
      } else if (att.corp) {
        // it can be also without character_id = Standup Einherji I for example
        addKey(allGroups, `corp:${att.corp}`)
      } else {
        // its just NPC entities - Angel Heavy Missile Battery etc
        // console.warn('attacker without ally and corp:', km.killmail_id, att) // eslint-disable-line
      }
    })
  })
  // sort by total impact value
  allGroups.sortedByImpact = Object.keys(allGroups).sort((a, b) => allGroups[b] - allGroups[a])
  return allGroups
}

export const getTeams = data => {
  // 0. get all involved allys and corps
  // 99006863: 250
  // 99007379: 416
  // 1614483120: 477
  // 99006795: 1
  // [allyID]: "impact" value - activity coeff
  const allGroups = getAllGroups(data)

  const victims = {}
  // 1. get cross mapping between involved alliances
  // 99003214:{99003581: 1}
  // 99003581:{99003214: 118, 99003581: 107, 99004840: 1}
  // 99006069:{498125261: 3, 1727758877: 10}

  const attachToParty = (km, partyItem) => {
    km.attackers.forEach(att => {
      if (att.ally) {
        addKey(partyItem, att.ally)
      } else if (att.corp) {
        addKey(partyItem, `corp:${att.corp}`)
      } else {
        // its just NPC entities - Angel Heavy Missile Battery etc
      }
    })
  }
  // parsing all victims to make cross relations between allys/corps
  data.forEach(km => {
    const allyID = km.victim.ally
    if (allyID) {
      victims[allyID] = victims[allyID] || {}
      attachToParty(km, victims[allyID])
    } else if (km.victim.corp) {
      const corpID = `corp:${km.victim.corp}`
      victims[corpID] = victims[corpID] || {}
      attachToParty(km, victims[corpID])
    } else {
      // its just NPC entities - Angel Heavy Missile Battery etc
    }
  })

  // 2. sort victims by involved count
  victims.sorted = Object.keys(victims).sort((a, b) => {
    const sumA = Object.keys(victims[a]).reduce((sum, currID) => sum + victims[a][currID], 0)
    const sumB = Object.keys(victims[b]).reduce((sum, currID) => sum + victims[b][currID], 0)
    return sumB - sumA
  })

  victims.damageDealt = {} // killwhored count
  allGroups.sortedByImpact.forEach(allyKey => {
    victims.damageDealt[allyKey] = []
  })
  Object.keys(victims).forEach(allyVictim => {
    if (allyVictim !== 'sorted' && allyVictim !== 'damageDealt') {
      Object.keys(victims[allyVictim]).forEach(allyAggressed => {
        const killwhoredCount = victims[allyVictim][allyAggressed]
        if (!victims.damageDealt[allyAggressed]) {
          console.warn('WTF', allyAggressed, victims.damageDealt)
        } else {
          victims.damageDealt[allyAggressed].push([allyVictim, killwhoredCount])
        }
      })
    }
  })
  // sort by most killwhored targets
  Object.keys(victims.damageDealt).forEach(allyAggressed => {
    victims.damageDealt[allyAggressed].sort((a, b) => b[1] - a[1])
  })

  if (process.env.NODE_ENV === 'development') {
    // console.warn('allGroups', allGroups)
    // console.warn('victims', victims)
  }

  // 3. split them all in 2 teams
  const first = []
  const second = []
  let sortedByImpact = [...allGroups.sortedByImpact]
  const firstAllyID = sortedByImpact.shift()
  if (!firstAllyID) {
    return invalidReport(allGroups)
  }
  first.push(firstAllyID)

  let firstAllyEnemyID
  const firstEnemy = victims.damageDealt[firstAllyID]
  if (!firstEnemy || !firstEnemy[0] || !firstEnemy[0][0]) {
    firstAllyEnemyID = sortedByImpact.shift()
    if (!firstAllyEnemyID) {
      return invalidReport(allGroups)
    }
  } else {
    // max whored enemy ally
    firstAllyEnemyID = firstEnemy[0][0] // eslint-disable-line
  }
  second.push(firstAllyEnemyID)

  // remove firstAllyEnemyID from list also
  sortedByImpact = sortedByImpact.filter(allyID => allyID !== firstAllyEnemyID)
  // parse remaining involved
  sortedByImpact.forEach(allyID => {
    if (victims[allyID]) {
      const matchedFirst = victims[allyID][first[0]]
      const matchedSecond = victims[allyID][second[0]]
      // console.log({ ix, allyID, matchedFirst, matchedSecond })
      if (!matchedSecond && !matchedFirst) {
        // not whored to anyone from first/second, but was killed
        if (process.env.NODE_ENV === 'development') {
          console.log('not whored, but was killed', allyID, victims[allyID])
        }
        const someAllyID = Object.keys(victims[allyID])[0]
        if (first.includes(someAllyID)) {
          second.push(allyID)
        } else {
          first.push(allyID)
        }
      } else if (!matchedSecond || matchedFirst > matchedSecond) {
        second.push(allyID)
      } else {
        first.push(allyID)
      }
    } else {
      const maxWhoredEnemyAllyID = victims.damageDealt[allyID][0][0] // max whored enemy ally
      if (first.includes(maxWhoredEnemyAllyID)) {
        second.push(allyID)
      } else {
        first.push(allyID)
      }
    }
  })

  return [
    first,
    second,
  ]
}

export const moveMemberToTeam = (teams, { ixFrom, ixTo, member }) => {
  if (ixTo >= teams.length || ixTo < 0) {
    if (teams.length >= 7) {
      console.log('Cannot create more than 7 teams')
      return teams
    }

    // do not allow empty teams
    if (teams[ixFrom].length <= 1) {
      return teams
    }

    teams[ixFrom] = teams[ixFrom].filter(el => el !== member)
    if (ixTo < 0) {
      teams.unshift([])
      teams[0].push(member)
    } else {
      teams.push([])
      teams[teams.length - 1].push(member)
    }
    return teams
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('moveMemberToTeam', teams, { ixFrom, ixTo, member })
  }
  teams[ixFrom] = teams[ixFrom].filter(el => el !== member)
  teams[ixTo].push(member)
  if (teams[ixFrom].length === 0) {
    const shrinkedTeams = teams.filter(t => t.length > 0)
    return shrinkedTeams
  }
  return teams
}
