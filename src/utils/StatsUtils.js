import numeral from 'numeral'
// TODO: tune fighter lossValue
// Support Fighter // value * 3
// Heavy Fighter // value * 6
// Light Fighter // value * 9
// Space Superiority Fighter // value * 12

function calcTeamStats(invShips, invChars) {
  if (process.env.NODE_ENV === 'development') {
    console.log({ invShips, invChars })
  }
  if (!invShips || invShips.length === 0) return {}

  const totalDmg = invShips.reduce((total, ship) => total + ship.dmg, 0)

  const maxDmg = invShips.reduce((max, ship) => {
    if (!ship.charID) return 0
    return Math.max(max, ship.dmg)
  }, 0)

  const maxCnt = invShips.reduce((max, ship) => {
    if (!ship.charID) return 0
    return Math.max(max, ship.cnt)
  }, 0)

  const lossCount = Object.keys(invChars).reduce((total, charIDKey) => {
    const inv = invChars[charIDKey]
    if (inv && inv.losses) {
      return total + inv.losses.length
    }
    return total
  }, 0)

  const totalLossValue = Object.keys(invChars).reduce((total, charIDKey) => {
    const inv = invChars[charIDKey]
    if (inv && inv.losses) {
      const sum = inv.losses.reduce((totalValue, loss) => totalValue + loss.lossValue, 0)
      return total + sum
    }
    return total
  }, 0)

  return {
    totalDmg,
    maxDmg,
    maxCnt,
    pilotsCount: invShips.length,
    lossCount,
    totalLossValue,
  }
}

const getInvolvedCount = (involved, allyIDstr, names) => { // eslint-disable-line
  const arr = [] // eslint-disable-line
  let count = 0
  if (!involved) return count

  if (allyIDstr.startsWith('corp:')) {
    const corpID = parseInt(allyIDstr.replace('corp:', ''), 10)
    count = Object.keys(involved).reduce((total, charID) => {
      const char = involved[charID]
      // do not count structures
      // if (char.structure) return total

      // !char.allyID - MTU losses come without allyID :facepalm:
      if (char.corpID === corpID && !char.allyID) {
        return (total + 1)
      }
      return total
    }, 0)

  } else {
    const allyID = parseInt(allyIDstr, 10)
    count = Object.keys(involved).reduce((total, charID) => {
      const char = involved[charID]
      // do not count structures
      // if (char.structure) return total

      if (char.allyID === allyID) {
        // if (allyIDstr === '1614483120') {
        //   arr.push({ charID, ...char })
        // }
        return (total + 1)
      }
      return total
    }, 0)

    // if (allyIDstr === '1614483120') {
    //   console.log('BSOD', arr)
    //   const chars = arr.map(char => char.charID)
    //   chars.sort()
    //   chars.forEach(id => console.log(`${id}: ${names.chars[id]}`))
    // }
  }
  return count
}

const calcInvolvedCounts = (team, involved, names) => {
  const counts = {}
  team.forEach(allyID => {
    const involvedCount = getInvolvedCount(involved, allyID, names)
    counts[allyID] = involvedCount
  })
  return counts
}

export const calculateStatistics = (involvedByShips, involvedMembers, team, names) => {
  const stats = calcTeamStats(involvedByShips, involvedMembers)
  stats.membersCount = calcInvolvedCounts(team, involvedMembers, names)
  // sort Team by Count
  team.sort((a, b) => (stats.membersCount[b] - stats.membersCount[a]))
  return stats
}

export const calcGeneralStats = teamsStats => {
  let generalStats = {
    dmg: 0,
    lossCount: 0,
    pilotsCount: 0,
    totalLossValue: 0,
  }
  generalStats = teamsStats.reduce((total, stat) => {
    total.dmg += stat.totalDmg
    total.lossCount += stat.lossCount
    total.pilotsCount += stat.pilotsCount
    total.totalLossValue += stat.totalLossValue
    return total
  }, generalStats)

  // calc efficiency of each team
  teamsStats.forEach(stat => {
    const efficiency = 1 - stat.totalLossValue / generalStats.totalLossValue
    stat.efficiency = numeral(efficiency).format('0,0.0%')
  })
  if (process.env.NODE_ENV === 'development') {
    console.log('generalStats:', generalStats)
  }
  return generalStats
}
