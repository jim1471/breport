import React, { Component } from 'react'
import ItemIcon from 'icons/ItemIcon'
import styles from './styles.scss'


export default class ShipInfo extends Component {

  static defaultProps = {
    charName: 'charName',
    shipName: 'shipName',
  }

  renderCharName() {
    const { id, names, charID } = this.props
    const charName = names.chars[charID] || ''
    if (id) return charName
    return (
      <a
        className={styles.unknownShip}
        href={`https://zkillboard.com/character/${charID}/`}
        target='_blank'
        rel='noopener noreferrer'
      >
        {charName}
      </a>
    )
  }

  render() {
    const { id, shipName, killID, podKillID, onRenderDmg, inv, onToggleExpanded, lossValue } = this.props

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
            <div className={styles.charName}>
              {this.renderCharName()}
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
            <span>
              {inv &&
                <span className={styles.moreShipsBtn} onClick={onToggleExpanded}>
                  {`(${Object.keys(inv.ships).length} ships)`}
                </span>
              }
              {lossValue &&
                <span className={styles.lossValue}>
                  &nbsp;
                  {lossValue}
                </span>
              }
            </span>
          </div>
          <div className={styles.shiptype}>
            {shipName}
            {onRenderDmg && onRenderDmg()}
          </div>
        </span>
      </div>
    )
  }
}
