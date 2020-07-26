import React, { Component } from 'react'
import classnames from 'classnames'
import { ItemIcon } from 'components'
import { formatSum } from 'utils/FormatUtils'
import ParseUtils from 'utils/ParseUtils'
import { SHIP_GROUPS, FIGHTERS_GROUPS, STRUCTURES, getFighterCoef } from 'data/constants'
import styles from './stylesSummary.scss'
import teamStyles from './styles.scss'


function groupShipsNew(data, countFightersAsSquad) {
  const shipsTypes = {}
  data.forEach(ship => {
    if (ship.inv && ship.inv.ships) {
      Object.keys(ship.inv.ships).forEach(shipID => {
        if (shipID) {
          shipsTypes[shipID] = shipsTypes[shipID] || { inv: 0, losed: 0, sum: 0 }
          const invShip = ship.inv.ships[shipID]
          if (invShip.losses) {
            invShip.losses.forEach(loss => {
              let coeff = 1
              if (countFightersAsSquad) {
                const group = SHIP_GROUPS.find(grp => grp[0] === loss.ship)
                if (group && FIGHTERS_GROUPS.includes(group[2])) {
                  coeff = getFighterCoef(group[2], loss.ship)
                }
              }
              shipsTypes[shipID].inv += 1
              shipsTypes[shipID].losed += 1
              shipsTypes[shipID].sum += loss.lossValue * coeff
            })
          } else {
            shipsTypes[shipID].inv += 1
          }
        }
      })

    } else {
      if (ship.id) {
        shipsTypes[ship.id] = shipsTypes[ship.id] || { inv: 0, losed: 0, sum: 0 }
        shipsTypes[ship.id].inv += 1
        if (ship.loss) {
          shipsTypes[ship.id].losed += 1
          shipsTypes[ship.id].sum += ship.loss.lossValue
        }
      }

      if (ship.podLoss) {
        if (ship.podLoss.ship) {
          shipsTypes[ship.podLoss.ship] = shipsTypes[ship.podLoss.ship] || { inv: 0, losed: 0, sum: 0 }
          shipsTypes[ship.podLoss.ship].inv += 1
          shipsTypes[ship.podLoss.ship].losed += 1
          shipsTypes[ship.podLoss.ship].sum += ship.podLoss.lossValue
        }
      }
    }
  })
  // set group names
  Object.keys(shipsTypes).forEach(key => {
    const shipTypeID = parseInt(key, 10)
    const group = SHIP_GROUPS.find(grp => grp[0] === shipTypeID)
    if (group) {
      // const [typeID, name, groupID, groupName, categoryID, categoryName] = group
      const [,, id, name] = group // actually this is Category
      shipsTypes[shipTypeID].groupID = id // group[2]
      shipsTypes[shipTypeID].groupName = name // group[3]
    } else {
      // it is Structure probably
      const structure = STRUCTURES.find(grp => grp[0] === shipTypeID)
      if (structure) {
        const [,, id, name] = structure // actually this is Category
        shipsTypes[shipTypeID].groupID = id // group[2]
        shipsTypes[shipTypeID].groupName = name // group[3]
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('WTF, unknown GROUP for shipTypeID:', shipTypeID, shipsTypes[shipTypeID])
      }
    }
  })

  return shipsTypes
}


export default class TeamSummary extends Component {

  state = {
    groupedMode: false,
    shipsTypes: null,
    shipsTypesSorted: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data || prevState.settings !== nextProps.settings) {
      const { data, settings: { countFightersAsSquad } } = nextProps
      const shipsTypes = groupShipsNew(data, countFightersAsSquad)
      const shipsTypesSorted = ParseUtils.sortCharShips(Object.keys(shipsTypes).map(id => parseInt(id, 10)))
      const shipsGroups = {}
      const shipsGroupsSorted = []
      shipsTypesSorted.forEach(typeID => {
        const shipType = shipsTypes[typeID]
        const { groupID } = shipType
        shipsGroups[groupID] = shipsGroups[groupID] || { inv: 0, losed: 0, sum: 0, name: shipType.groupName }
        shipsGroups[groupID].inv += shipType.inv
        shipsGroups[groupID].losed += shipType.losed
        shipsGroups[groupID].sum += shipType.sum
        if (!shipsGroupsSorted.includes(groupID)) {
          shipsGroupsSorted.push(groupID)
        }
      })
      return {
        data,
        shipsTypes,
        shipsTypesSorted,
        shipsGroups,
        shipsGroupsSorted,
      }
    }
    return null
  }

  toggleMode = () => {
    this.setState(prevState => ({ groupedMode: !prevState.groupedMode }))
  }

  renderShipType(shipID) {
    const { shipsTypes } = this.state
    const { names } = this.props
    const shipType = shipsTypes[shipID]
    if (!shipType) {
      return null
    }
    const shipName = names.types[shipID]

    const lossValue = shipType.sum ? formatSum(shipType.sum) : ''
    const lossValueClassName = classnames(
      styles.red,
      lossValue && shipType.sum > 1000000000 && styles.bold,
    )

    return (
      <div className={styles.root} key={shipID}>
        <ItemIcon id={shipID} />
        <div className={styles.info}>

          <div className={styles.names}>
            <div className={styles.shipName}>
              {shipName}
            </div>
            <div className={styles.shipGroupName}>
              {shipType.groupName}
            </div>
          </div>

          <div className={styles.counts}>
            <div>
              {shipType.inv}
            </div>
            <div className={styles.red}>
              {shipType.losed || ''}
            </div>
            <div className={lossValueClassName}>
              {lossValue}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderShipGroup(groupID) {
    const { shipsGroups } = this.state
    const shipGroup = shipsGroups[groupID]
    if (!shipGroup) {
      return null
    }
    const lossValue = shipGroup.sum ? formatSum(shipGroup.sum) : ''
    const lossValueClassName = classnames(
      styles.red,
      lossValue && shipGroup.sum > 1000000000 && styles.bold,
    )
    return (
      <div className={styles.root} key={groupID}>
        <div className={classnames(styles.info, styles.group)}>
          <div className={styles.names}>
            {shipGroup.name}
          </div>

          <div className={styles.counts}>
            <div>
              {shipGroup.inv}
            </div>
            <div className={styles.red}>
              {shipGroup.losed || ''}
            </div>
            <div className={lossValueClassName}>
              {lossValue}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { groupedMode, shipsTypesSorted, shipsGroupsSorted } = this.state
    return (
      <div className={teamStyles.team}>
        <div className={styles.btnExpand} onClick={this.toggleMode}>
          {groupedMode ? 'Ship Groups' : 'Ship Types'}
          <span className={styles.hint}> (click to change)</span>
        </div>
        {!groupedMode && shipsTypesSorted &&
          shipsTypesSorted.map(shipID => this.renderShipType(shipID))
        }
        {groupedMode && shipsGroupsSorted &&
          shipsGroupsSorted.map(groupID => this.renderShipGroup(groupID))
        }
      </div>
    )
  }
}
