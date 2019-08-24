import React, { Component } from 'react'
import classnames from 'classnames'
import { ItemIcon } from 'components'
import { formatSum } from 'utils/FormatUtils'
import ParseUtils from 'utils/ParseUtils'
import { SHIP_GROUPS } from 'data/constants'
import styles from './stylesSummary.scss'
import teamStyles from './styles.scss'


function groupShipsNew(data) {
  const shipsGroups = {}
  data.forEach(ship => {
    if (ship.inv && ship.inv.ships) {
      Object.keys(ship.inv.ships).forEach(shipID => {
        if (shipID) {
          shipsGroups[shipID] = shipsGroups[shipID] || { inv: 0, losed: 0, sum: 0 }
          const invShip = ship.inv.ships[shipID]
          if (invShip.losses) {
            invShip.losses.forEach(loss => {
              shipsGroups[shipID].inv += 1
              shipsGroups[shipID].losed += 1
              shipsGroups[shipID].sum += loss.lossValue
            })
          } else {
            shipsGroups[shipID].inv += 1
          }
        }
      })

    } else {
      if (ship.id) {
        shipsGroups[ship.id] = shipsGroups[ship.id] || { inv: 0, losed: 0, sum: 0 }
        shipsGroups[ship.id].inv += 1
        if (ship.loss) {
          shipsGroups[ship.id].losed += 1
          shipsGroups[ship.id].sum += ship.loss.lossValue
        }
      }

      if (ship.podLoss) {
        if (ship.podLoss.ship) {
          shipsGroups[ship.podLoss.ship] = shipsGroups[ship.podLoss.ship] || { inv: 0, losed: 0, sum: 0 }
          shipsGroups[ship.podLoss.ship].inv += 1
          shipsGroups[ship.podLoss.ship].losed += 1
          shipsGroups[ship.podLoss.ship].sum += ship.podLoss.lossValue
        }
      }
    }
  })
  // set group names
  Object.keys(shipsGroups).forEach(key => {
    const shipTypeID = parseInt(key, 10)
    const group = SHIP_GROUPS.find(grp => grp[0] === shipTypeID)
    if (group) {
      const [,, id, name] = group
      shipsGroups[shipTypeID].groupID = id // group[2]
      shipsGroups[shipTypeID].groupName = name // group[3]
    }
  })

  return shipsGroups
}


export default class TeamSummary extends Component {

  state = {
    shipsGroups: null,
    shipsSorted: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      const { data } = nextProps
      const shipsGroups = groupShipsNew(data)
      console.log('shipsGroups:', shipsGroups)
      const shipsSorted = ParseUtils.sortCharShips(Object.keys(shipsGroups).map(id => parseInt(id, 10)))
      return {
        data,
        shipsGroups,
        shipsSorted,
      }
    }
    return null
  }

  renderShipGroup(shipID) {
    const { shipsGroups } = this.state
    const { names } = this.props
    const shipType = shipsGroups[shipID]
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

  render() {
    const { shipsSorted } = this.state
    return (
      <div className={teamStyles.team}>
        {shipsSorted &&
          shipsSorted.map(shipID => this.renderShipGroup(shipID))
        }
      </div>
    )
  }
}
