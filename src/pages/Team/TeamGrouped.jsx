/* eslint array-callback-return: 'off' */
import React, { Component } from 'react'
import ShipGroup from 'components/ShipGroup'
import styles from './styles.scss'


export default class TeamGrouped extends Component {

  state = {
    ships: this.groupShips(this.props.data),
  }

  groupShips(data) {
    const ships = []
    data.forEach(ship => {
      const alreadyAdded = ships.find(grp => grp[0].id === ship.id)
      if (!alreadyAdded || alreadyAdded.length === 0) {
        const sameTypes = data.filter(sh => sh.id === ship.id)
        ships.push(sameTypes)
        // if (sameTypes.length > 5) {
        //   ships.push(sameTypes)
        // }
      }
    })
    // console.warn('shipTypes count:', ships.length)
    return ships
  }

  render() {
    const { data, names } = this.props
    const { ships } = this.state

    return (
      <div className={styles.team}>
        <h4>Team A ({data ? data.length : 0})</h4>
        {ships.map(group => {
          const ship = group[0]
          if (!ship.id) return null

          return (
            <ShipGroup data={group} names={names} key={ship.id} />
          )
        })}
      </div>
    )
  }
}
