import React, { Component } from 'react'
import ItemIcon from 'icons/ItemIcon'
import styles from './styles.scss'


export default class ShipInfo extends Component {

  static defaultProps = {
    charName: 'charName',
    shipName: 'shipName',
  }

  renderCharName() {
    const { names, charID } = this.props
    const charName = names.chars[charID] || ''
    // if (id) return charName
    return (
      <a
        className={styles.charName}
        href={`https://zkillboard.com/character/${charID}/`}
        target='_blank'
        rel='noopener noreferrer'
      >
        {charName}
      </a>
    )
  }

  renderLeftPart(names, charID, podKillID) {
    return (
      <div className={styles.charName}>
        <span title={names.chars[charID] || ''}>
          {this.renderCharName()}
        </span>
        {podKillID &&
          <a
            className={styles.pod}
            href={`https://zkillboard.com/detail/${podKillID}/`}
            target='_blank'
            rel='noopener noreferrer'
          >
            [pod]
          </a>
        }
      </div>
    )
  }

  renderRightPart(inv, time, lossValue) {
    // let multipleTypesStr = ''
    let multipleCountsLost = null
    if (inv) {
      const typesCount = Object.keys(inv.ships).length
      if (inv.structure) {
        // /related/30003106/202006170600
        if (process.env.NODE_ENV === 'development') {
          if (typesCount > 1) console.warn('typesCount > 1:', inv)
        }
        // here we supposing that count === 1 - only known case - Pos modules
        const typeID = Object.keys(inv.ships)[0]
        const lostCount = inv.ships[typeID].loss
        multipleCountsLost = (
          <span className={styles.moreStructuresLost}>
            {`x${lostCount} lost`}
          </span>
        )
      }
    }

    return (
      <span>
        {multipleCountsLost}
        {!time && lossValue &&
          <span className={styles.lossValue}>
            &nbsp;
            {lossValue}
          </span>
        }
        {time}
      </span>
    )
  }

  render() {
    const {
      id, shipName, killID, podKillID, onRenderDmg,
      inv, lossValue, time, names, charID,
    } = this.props

    return (
      <div className={styles.root}>
        {killID &&
          <a
            className={styles.killmail}
            href={`https://zkillboard.com/kill/${killID}/`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <ItemIcon id={id} />
          </a>
        }
        {!killID &&
          <ItemIcon id={id} />
        }

        <span className={styles.ship}>

          <div className={styles.char}>
            {this.renderLeftPart(names, charID, podKillID)}
            {this.renderRightPart(inv, time, lossValue)}
          </div>

          <div className={styles.shiptype}>
            {shipName}
            {onRenderDmg && onRenderDmg()}
            {time && lossValue &&
              <span className={styles.lossValue}>
                &nbsp;
                {lossValue}
              </span>
            }
          </div>
        </span>
      </div>
    )
  }
}
