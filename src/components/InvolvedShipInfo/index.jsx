import React, { Component } from 'react'
import cn from 'classnames'
import numeral from 'numeral'
import styles from './styles.scss'


const fmtValue = losses => {
  const lossesValue = losses && losses.reduce((sum, loss) => sum + loss.lossValue, 0)
  return numeral(lossesValue).format('0.0a')
}
const rawDmg = dmg => {
  let format = '0a'
  if (dmg > 1000000) {
    format = '0.00a'
  }
  return dmg === 0 ? '' : `${numeral(dmg).format(format)}`
}
const dmgPercent = dmg => (
  dmg === 0 ? '' : `(${numeral(dmg).format('0,0.0%')})`
)
const cntWhored = cnt => (
  cnt === 0 || !cnt ? '' : ` [${cnt}]`
)

export default class InvolvedShipInfo extends Component {
  renderIcon() {
    const { shipID, ship } = this.props
    const icon = (
      <img
        style={{ width: 32, height: 32, verticalAlign: 'middle' }}
        alt={`typeID-${shipID}`}
        src={`https://imageserver.eveonline.com/Type/${shipID}_${64}.png`}
      />
    )
    if (!ship.losses) return icon

    // TODO: ? пока берем первое киллмыло
    const killID = ship.losses[0].id
    return (
      <a
        className={styles.killmail}
        href={`https://zkillboard.com/kill/${killID}/`}
        target='_blank'
        rel='noopener noreferrer'
      >
        {icon}
      </a>
    )
  }

  render() {
    const { shipID, ship, names, totalDmg } = this.props
    const dmg = ship.dmg ? `dmg: ${rawDmg(ship.dmg)}` : ''
    const dmgPrc = dmgPercent((ship.dmg || 0) / totalDmg)
    const cnt = ship.cnt ? cntWhored(ship.cnt) : ''
    return (
      <div className={cn(styles.root, ship.loss && styles.destroyed)}>
        <div className={styles.iconCont}>
          {this.renderIcon()}
        </div>

        <div className={styles.body}>
          <div className={styles.ship}>
            <span className={styles.shipName}>
              {names.types[shipID]}
            </span>
            <div>
              {ship.loss ? `${ship.loss} lost, ${fmtValue(ship.losses)}` : ''}
            </div>
          </div>

          <div className={styles.info}>
            <div>{`${dmg} ${dmgPrc}`}</div>
            <div>{cnt}</div>
          </div>
        </div>
      </div>
    )
  }
}
