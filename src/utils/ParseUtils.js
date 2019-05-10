/* eslint no-unused-vars: 0, no-empty: 0 */
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import { SHIP_TYPES, CITADELS, NPC_SHIPS } from 'data/constants'
import * as TeamsUtils from './TeamsUtils'
import * as StatsUtils from './StatsUtils'


class ParseUtils {

  getLossesByTeam(data, allys) {
    let kms = []
    allys.forEach(allyID => {
      if (allyID.indexOf('corp:') === 0) {
        const corpID = parseInt(allyID.replace('corp:', ''))
        kms = kms.concat(data.filter(km => (km.victim.corp === corpID) && (!km.victim.ally)))
      } else {
        kms = kms.concat(data.filter(km => km.victim.ally === parseInt(allyID)))
      }
    })

    // Sort by timestamp Ascending
    kms = sortBy(kms, km => km.time)

    return kms
  }

  filterLosses(data, exceptLosses) {
    const ids = exceptLosses.map(km => km.id)
    const result = data.filter(km => !ids.includes(km.id))
    return result
  }

  filterOtherTeams(teams, excludeIndex) {
    let otherTeams = []
    teams.forEach((team, ix) => {
      if (ix !== excludeIndex) {
        otherTeams = otherTeams.concat(team)
      }
    })
    return otherTeams
  }

  addShipStat(char, data, lossKm) {
    char.ships = char.ships || {}
    if (!lossKm) {
      // kills
      if (!data.ship) {
        char.unknown = char.unknown || {}
        char.unknown.weapons = char.unknown.weapons || {}
        char.unknown.weapons[data.weap] = char.unknown.weapons[data.weap] || {}
        const unknShip = char.unknown.weapons[data.weap]
        // cnt & dmg by ship
        char.unknown.weapons[data.weap].cnt = (unknShip.cnt || 0) + 1
        char.unknown.weapons[data.weap].dmg = (unknShip.dmg || 0) + (data.dmg || 0)
      } else {
        char.ships[data.ship] = char.ships[data.ship] || {}
        const ship = char.ships[data.ship]
        // cnt & dmg by ship
        char.ships[data.ship].cnt = (ship.cnt || 0) + 1
        char.ships[data.ship].dmg = (ship.dmg || 0) + (data.dmg || 0)
      }
    } else {
      // losses
      char.ships[data.ship] = char.ships[data.ship] || {}
      char.ships[data.ship].loss = (char.ships[data.ship].loss || 0) + 1
      char.ships[data.ship].losses = char.ships[data.ship].losses || []
      char.ships[data.ship].losses.push(lossKm)
      char.losses = char.losses || []
      char.losses.push(lossKm)
    }
  }

  addCharStat(char, att, victim) {
    char.allyID = char.allyID || att.ally
    char.corpID = char.corpID || att.corp
    // Summary cnt & dmg
    char.cnt = (char.cnt || 0) + 1
    char.dmg = char.dmg || 0

    // TODO: need customization mechanic to filter damage to Structures / to Capitals / from Capitals / etc
    // if (!CITADELS.includes(victim.ship)) {
    //   char.dmg += (att.dmg || 0)
    // }
    char.dmg += (att.dmg || 0)

    this.addShipStat(char, att, false)
  }

  addCharStatFromLoss(char, v, km) {
    char.allyID = char.allyID || v.ally
    char.corpID = char.corpID || v.corp
    char.cnt = char.cnt || 0 // if char not whored anywhere
    char.dmg = char.dmg || 0 // need this here to prevent NaN in later calculations

    const simpleKm = {
      id: km.id,
      system: km.system,
      time: new Date(km.time).getTime(),
      ...km.victim,
    }
    if (!v.ship) {
      console.error('WTF: victim without ship', v)
    }
    this.addShipStat(char, v, simpleKm)
  }

  getInvolved(kills, killsSelfTeam, losses, names) {
    const result = {}
    // parse enemy kills to agregate all stats for character
    kills.forEach(km => {
      const v = km.victim
      km.attackers.forEach(att => {

        // here we should exclude friendly fire from self team members
        const equalTeam = killsSelfTeam.findIndex(allyID => (
          allyID === `${att.ally}` || allyID === `corp:${att.corp}`
        ))

        if (equalTeam >= 0) {
          // TODO: FriendlyFire Chart?
          // if (att.dmg > 0) {
          //   console.log({ killsSelfTeam })
          //   console.log('friendly fire:', { kmId: km.id, v, dmg: att.dmg, attAlly: att.ally, attCorp: att.corp })
          // }
        } else if (att.char) {
          result[att.char] = result[att.char] || {}
          this.addCharStat(result[att.char], att, v)

        } else if (CITADELS.includes(att.ship)) {
          // TODO: citadel or ...
          const citadelId = `structure-${att.corp}-${att.ship}`
          result[citadelId] = result[citadelId] || {}
          result[citadelId].structure = true
          this.addCharStat(result[citadelId], att, v)

        } else if (process.env.NODE_ENV === 'development') {
          // Tower Sentry Angel / Angel Legionnaire / Angel Heavy Missile Battery / etc
          const isNPC = NPC_SHIPS[att.ship]
          if (!isNPC) {
            if (att.ally || att.corp) { // eslint-disable-line
              console.error('no charId:', names.types[att.ship], att, km.id)
            } else {
              console.warn('probably npc: no charId:', names.types[att.ship], att, km.id)
            }
          }
        }
      })
    })

    // parse self losses to find losed ship/capsules
    losses.forEach(km => {
      const v = km.victim
      if (v.char) {
        result[v.char] = result[v.char] || {}
        this.addCharStatFromLoss(result[v.char], v, km)
        // if (v.char === 92532650) {
        //   console.log('km:', km.id, result[v.char])
        // }

      } else if (CITADELS.includes(v.ship)) {
        // TODO: citadel or ...
        const citadelId = `structure-${v.corp}-${v.ship}`
        result[citadelId] = result[citadelId] || {}
        result[citadelId].structure = true
        this.addCharStatFromLoss(result[citadelId], v, km)
      }
    })

    return result
  }

  aggregateShips(involved, losses, names) {
    let ships = []
    const unprocessedLosses = losses
    ships = Object.keys(involved).map(charIDKey => {
      const inv = involved[charIDKey]
      let charID
      if (inv.structure) {
        charID = charIDKey
      } else {
        charID = parseInt(charIDKey, 10)
      }
      if (Number.isNaN(charID) || !charIDKey) {
        if (process.env.NODE_ENV === 'development') console.error('charIDKey:', charIDKey, inv)
        charID = charIDKey
      }

      const charStats = {
        charID,
        corpID: inv.corpID,
        allyID: inv.allyID,
        cnt: inv.cnt,
        dmg: inv.dmg,
        allLossesValue: 0,
        // id: 0,
        // loss: null,
        // killID: 0,
        // podLoss: null,
        // podKillID: 0,
      }

      // 0. Uknown ship, whored & no lossmail
      if (!inv.ships || isEmpty(inv.ships)) {
        if (process.env.NODE_ENV === 'development') {
          const weapons = Object.keys(inv.unknown.weapons).map(weapID => names.types[weapID])
          console.error('ship without ID', weapons)
        }
        return {
          ...charStats,
          weapons: inv.unknown.weapons,
        }
      }

      const allShipsIds = Object.keys(inv.ships).map(id => parseInt(id, 10))
      // 670: "Capsule" // 33328: "Capsule - Genolution 'Auroral' 197-variant"
      const withoutPods = allShipsIds.filter(shipID => (shipID !== 33328 && shipID !== 670))
      const pods = allShipsIds.filter(shipID => (shipID === 33328 || shipID === 670))
      // calculate loss value of all char ship losses
      const allLossesValue = Object.keys(inv.ships).reduce((totalSum, shipID) => {
        const shipLosses = inv.ships[shipID].losses
        if (shipLosses) {
          return totalSum + shipLosses.reduce((sum, loss) => sum + loss.lossValue, 0)
        }
        return totalSum
      }, 0)
      charStats.allLossesValue = allLossesValue

      // 1. only POD[s]
      if (withoutPods.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.error('only POD[s]:', allShipsIds, inv)
          if (allShipsIds.length > 1) {
            console.error('more than one PODs:', allShipsIds.length)
          }
        }
        const multiplePods = []
        allShipsIds.forEach(shipID => {
          const item = {
            ...charStats,
            id: shipID,
          }
          if (inv.ships[shipID].loss > 0) {
            inv.ships[shipID].losses.forEach(lossKm => {
              multiplePods.push({
                ...item,
                loss: lossKm,
                killID: lossKm.id,
              })
            })
          } else {
            multiplePods.push(item)
          }
        })
        return multiplePods
      }

      if (process.env.NODE_ENV === 'development') {
        // if (charIDKey === '92532650') {
        //   console.log('Matched char:', inv)
        //   console.log('allShipsIds:', allShipsIds)
        //   console.log('withoutPods:', withoutPods)
        // }
      }

      // 2. only single Ship
      if (allShipsIds.length === 1) {
        const onlyShip = inv.ships[allShipsIds[0]]
        // if only ship have many losses - then we need InternalRowGrouping here
        if (!onlyShip.loss || onlyShip.loss <= 1) {
          const shipID = withoutPods.pop()
          const item = {
            ...charStats,
            id: shipID,
          }
          const shipAndLosses = []
          if (inv.ships[shipID].loss > 0) {
            inv.ships[shipID].losses.forEach(lossKm => {
              shipAndLosses.push({
                ...item,
                loss: lossKm,
                killID: lossKm.id,
              })
            })
          } else {
            shipAndLosses.push(item)
          }
          return shipAndLosses
        }
      }

      // 2.1. single Ship with pod || with whored-capsule
      if (allShipsIds.length === 2 && withoutPods.length === 1) {
        const onlyShip = inv.ships[withoutPods[0]]
        // if only ship have many losses - then we need InternalRowGrouping here
        if (!onlyShip.loss || onlyShip.loss <= 1) {
          const shipID = withoutPods.pop()
          const item = {
            ...charStats,
            id: shipID,
          }
          const lossKm = inv.ships[shipID].losses && inv.ships[shipID].losses[0]
          if (lossKm) {
            item.loss = lossKm
            item.killID = lossKm.id
          }
          const podID = pods.pop() // 33328 || 670
          const podLoss = inv.ships[podID].losses && inv.ships[podID].losses[0]
          // it may be just whored-km where only capsule exists
          // (when self ship destroyed before the target)
          if (podLoss) {
            item.podLoss = podLoss
            item.podKillID = podLoss.id
          }
          return item
        }
      }

      // I. Group all ships in one row by Char
      const sortedShips = this.sortCharShips(allShipsIds)
      const topShipID = sortedShips[0]
      const lossKm = inv.ships[topShipID].losses && inv.ships[topShipID].losses[0]
      const item = {
        id: topShipID,
        ...charStats,
        sortedShips,
        inv,
        loss: lossKm,
      }
      if (lossKm) {
        item.killID = lossKm.id
      }
      return item
    })

    // flat()
    ships = ships.reduce((acc, val) => acc.concat(val), [])
    ships = this.sortShips(ships, names)

    return ships
  }

  sortCharShips(shipsIds) {
    const positionForUnknown = 0
    shipsIds.sort((shipA, shipB) => {
      const ixA = SHIP_TYPES.findIndex(type => type[0] === shipA) || positionForUnknown
      const ixB = SHIP_TYPES.findIndex(type => type[0] === shipB) || positionForUnknown
      return ixA - ixB
    })
    return shipsIds
  }

  sortShips(ships, names) {
    let positionForUnknown = 0
    if (process.env.NODE_ENV === 'development') {
      // for debug - move unknown typeID to top of list
      positionForUnknown = 1000
    }

    // sort ships by majority and value
    ships.sort((shipA, shipB) => {
      if (!shipA.id) return 1
      if (!shipB.id) return -1 // move unknown chars to end of list
      const ixA = SHIP_TYPES.findIndex(type => type[0] === shipA.id) || positionForUnknown
      const ixB = SHIP_TYPES.findIndex(type => type[0] === shipB.id) || positionForUnknown
      // console.log('IX:', ixA, ixB, ixA - ixB)
      return ixA - ixB
    })

    // sort by Name inside shiptype
    ships.sort((shipA, shipB) => {
      if (shipA.id === shipB.id) {
        const nameA = names.chars[shipA.charID]
        const nameB = names.chars[shipB.charID]
        if (!nameA || !nameB) {
          // CITADELS and their weapons
          return 0
        }
        if (!nameA.localeCompare || !nameB.localeCompare) {
          // console.log({ shipA, shipB })
          // console.log({ nameA, nameB })
          return 0
        }
        return nameA.localeCompare(nameB)
      }
      return 0
    })

    return ships
  }

  getSystemStat(origData) {
    const data = origData.map(km => ({
      system: km.system,
      time: new Date(km.time),
    }))
    data.sort((a, b) => a.time - b.time)

    return {
      systemID: data[0].system,
      fromTime: data[0].time,
      toTime: data[data.length - 1].time,
    }
  }

  constructTeams(data) {
    data = data.filter(km => { // eslint-disable-line
      if (km.notFound) {
        console.error('Not Founded km:', km)
        return false
      }
      return true
    })

    console.time('get teams')
    const teams = TeamsUtils.getTeams(data)
    console.timeEnd('get teams')

    console.log('teams:', teams)
    return teams
  }

  parseTeams(teams, data, names, isTeamsConstructed = false) {
    console.time('parse teams')
    const systemStats = this.getSystemStat(data)
    const teamsLosses = []
    const teamsInvolved = []
    const teamsShips = []
    const teamsStats = []
    teams.forEach((team, ix) => {
      console.time(`parse kms: ${ix}`)
      const selfLosses = this.getLossesByTeam(data, team)
      const kills = this.filterLosses(data, selfLosses)
      const otherTeams = this.filterOtherTeams(teams, ix)
      console.timeEnd(`parse kms: ${ix}`)
      // ...
      console.time(`members: ${ix}`)
      const involvedMembers = this.getInvolved(kills, otherTeams, selfLosses, names)
      console.timeEnd(`members: ${ix}`)

      console.time(`ships: ${ix}`)
      const involvedByShips = this.aggregateShips(involvedMembers, selfLosses, names)
      console.timeEnd(`ships: ${ix}`)

      teamsLosses.push(selfLosses)
      teamsInvolved.push(involvedMembers)
      teamsShips.push(involvedByShips)
      const stats = StatsUtils.calculateStatistics(involvedByShips, involvedMembers, team, names)
      teamsStats.push(stats)
    })
    console.timeEnd('parse teams')

    return {
      kmCount: data.length,
      involvedNames: names,
      systemStats,
      teams,
      teamsLosses,
      teamsInvolved,
      teamsShips,
      teamsStats,
      origTeams: isTeamsConstructed ? [...teams] : null,
    }
  }

  mainParse(data, involvedNames) {
    if (!data) return null
    const teams = this.constructTeams(data)
    return this.parseTeams(teams, data, involvedNames, true)
  }

}

export default new ParseUtils()
