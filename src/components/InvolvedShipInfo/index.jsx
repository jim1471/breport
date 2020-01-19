import React, { Component } from 'react'
import cn from 'classnames'
import { formatSum, formatDmg, dmgPercent, cntWhored } from 'utils/FormatUtils'
import ParseUtils from 'utils/ParseUtils'
import { SHIP_GROUPS, FIGHTERS_GROUPS, getFighterCoef } from 'data/constants'
import styles from './styles.scss'


const fmtLosses = losses => {
  const lossesValue = losses && losses.reduce((sum, loss) => {
    if (ParseUtils.settings.countFightersAsSquad) {
      const group = SHIP_GROUPS.find(grp => grp[0] === loss.ship)
      if (group && FIGHTERS_GROUPS.includes(group[2])) {
        const coeff = getFighterCoef(group[2], loss.ship)
        return sum + loss.lossValue * coeff
      }
    }
    return sum + loss.lossValue
  }, 0)
  return formatSum(lossesValue)
}

export default class InvolvedShipInfo extends Component {
  renderIcon() {
    const { shipID, ship } = this.props
    const icon = (
      <img
        style={{ width: 32, height: 32, verticalAlign: 'middle' }}
        alt={`typeID-${shipID}`}
        src={`https://images.evetech.net/types/${shipID}/icon?size=64`}
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
    const dmg = ship.dmg ? `dmg: ${formatDmg(ship.dmg)}` : ''
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
            {ship.loss &&
              <div>
                <span>{`${ship.loss} lost, `}</span>
                {fmtLosses(ship.losses)}
              </div>
            }
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
