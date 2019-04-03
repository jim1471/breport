import React, { Component } from 'react'
import classnames from 'classnames'
import numeral from 'numeral'
import AllyIcon from './AllyIcon'
import ItemIcon from './ItemIcon'
import styles from './ShipGroup.scss'


const formatSum = value => {
  if (value > 1000000000) {
    return numeral(value).format('0.00a')
  }
  return numeral(value).format('0a')
}

export default class ShipGroup extends Component {

  state = {
    ...this.calcStats(),
  }

  calcStats() {
    const { data, names } = this.props
    const shipID = data[0].id
    const shipName = names.types[shipID]
    const lost = data.reduce((sum, ship) => (ship.loss ? sum + 1 : sum), 0)
    const lossValue = data.reduce((sum, ship) => {
      if (!ship.loss) return sum
      return sum + ship.loss.lossValue
    }, 0)
    const fielded = data.length
    const alliances = {}
    data.forEach(ship => {
      if (ship.allyID) {
        alliances[ship.allyID] = 1
      }
    })

    return {
      shipID,
      shipName,
      lost: lost || '',
      lossValueNum: lossValue,
      lossValue: lossValue ? formatSum(lossValue) : '',
      fielded,
      allys: Object.keys(alliances).map(allyID => allyID),
    }
  }

  render() {
    const {
      shipID,
      shipName,
      lost, lossValue, lossValueNum,
      fielded, allys,
    } = this.state

    const lossValueClassName = classnames(
      styles.red,
      lossValueNum && lossValueNum > 1000000000 && styles.bold,
    )

    return (
      <div className={styles.root}>
        <ItemIcon id={shipID} />
        <div className={styles.info}>
          <div className={styles.shipName}>
            {shipName}
          </div>
          <div className={styles.counts}>
            <div>
              {fielded}
            </div>
            <div className={styles.red}>
              {lost && lost}
            </div>
            <div className={lossValueClassName}>
              {lossValue}
            </div>
          </div>
        </div>
        {false &&
          <div className={styles.allys}>
            {allys.map(allyID => (
              <AllyIcon key={allyID} allyID={allyID} names={this.props.names} />
            ))}
          </div>
        }
      </div>
    )
  }
}
