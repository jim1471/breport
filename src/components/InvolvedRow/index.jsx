import React, { Component } from 'react'
import cn from 'classnames'
import { formatSum, formatDmg, dmgPercent, cntWhored } from 'utils/FormatUtils'
import { AllyIcon, ShipInfo } from 'components'
import InvolvedShipInfo from 'components/InvolvedShipInfo'
import styles from './styles.scss'


export default class InvolvedRow extends Component {

  static defaultProps = {
    loss: false,
    killID: null,
    id: 17736,
    charID: 91628726,
    corpID: 98475638,
    allyID: 99006884,
    isTopDmg: false,
    isTopWhored: false,
    dmg: 0,
    cnt: 0,
  }

  state = {
    expanded: false,
    data: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data && !prevState.data && prevState.data !== nextProps.data) {
      const { data, names, totalDmg, maxDmg, maxCnt } = nextProps
      const { loss, dmg, cnt, allLossesValue } = data
      const isTopDmg = dmg === maxDmg && dmg > 0
      const isTopWhored = cnt === maxCnt && cnt > 0
      return {
        ...prevState,
        isTopDmg,
        isTopWhored,
        data, names, totalDmg, maxDmg, maxCnt,
        rawDmgValue: formatDmg(dmg),
        dmgPercentValue: dmgPercent(dmg / totalDmg),
        cntWhoredValue: cntWhored(cnt),
        fmtLossValue: loss ? formatSum(loss.lossValue) : '',
        allLossesValue: allLossesValue ? formatSum(allLossesValue) : '',
      }
    }
    return null
  }

  getShipName() {
    const { data: { id, weapons }, names } = this.state
    if (id) {
      return names.types[id]
    }
    // weapons ship
    let allWeaponsStr = 'unknown'
    try {
      if (weapons) {
        const sorted = Object.keys(weapons).sort((a, b) => {
          if (weapons[b].dmg !== weapons[a].dmg) {
            return weapons[b].dmg - weapons[a].dmg
          }
          return weapons[b].cnt - weapons[a].cnt
        })
        allWeaponsStr = sorted.map(wid => names.types[wid]).join('/')
        allWeaponsStr = (
          <span className={styles.unknownShipWeapons}>
            {allWeaponsStr}
          </span>
        )
      }
    } catch (e) {
      console.error('error while parsing unknown ship:', e)
    }
    return allWeaponsStr
  }

  toggleExpanded = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  renderOtherShips() {
    const { data, names, totalDmg } = this.state
    const { inv, sortedShips } = data
    const otherShips = (
      <div className={styles.otherShips}>
        {sortedShips.map(shipID => {
          // if (parseInt(shipID, 10) === rootID) return null
          const ship = inv.ships[shipID]
          return (
            <InvolvedShipInfo
              ship={ship}
              shipID={shipID}
              totalDmg={totalDmg}
              names={names}
              key={shipID}
            />
          )
        })}
      </div>
    )
    return otherShips
  }

  renderDmg = () => {
    const { rawDmgValue, dmgPercentValue, cntWhoredValue, isTopDmg, isTopWhored } = this.state

    return (
      <span className={styles.dmgGroup}>
        <div>
          {rawDmgValue === '0' &&
            <span>{rawDmgValue}</span>
          }
          {rawDmgValue !== '0' &&
            <span className={cn(isTopDmg && styles.top)}>
              {`${rawDmgValue} ${dmgPercentValue}`}
            </span>
          }
          <span className={cn(isTopWhored && styles.top)}>
            {cntWhoredValue}
          </span>
        </div>
      </span>
    )
  }

  renderContent() {
    const { expanded, data, names, fmtLossValue, allLossesValue } = this.state
    const { killID, loss, id, charID, allyID, corpID } = data

    return (
      <div className={styles.involvedRoot}>
        <div className={loss ? styles.destroyed : styles.teamRow}>
          <ShipInfo
            id={loss ? loss.ship : id}
            killID={killID}
            podKillID={data.podKillID}
            charID={charID}
            names={names}
            inv={data.inv}
            onToggleExpanded={this.toggleExpanded}
            shipName={this.getShipName()}
            onRenderDmg={this.renderDmg}
            lossValue={allLossesValue || fmtLossValue}
          />
          <AllyIcon corpID={corpID} names={names} />
          <AllyIcon allyID={allyID} names={names} />
        </div>
        {expanded && data.inv &&
          this.renderOtherShips()
        }
      </div>
    )
  }

  render() {
    return this.renderContent()
  }
}
