import React, { Component } from 'react'
import { timestampToUTC, formatSum } from 'utils/FormatUtils'
import { AllyIcon, ShipInfo } from 'components'
import styles from './styles.scss'


export default class TeamGrouped extends Component {

  renderEmptyRow(key) {
    return (
      <div className={styles.timelineRow} key={key} />
    )
  }

  renderLossRow(loss, key) {
    const { names } = this.props
    return (
      <div className={styles.timelineRowLoss} key={key}>
        <ShipInfo
          id={loss.victim.ship}
          killID={loss.id}
          charID={loss.victim.char}
          names={names}
          shipName={names.types[loss.victim.ship]}
          // onRenderDmg={this.renderDmg}
          lossValue={formatSum(loss.victim.lossValue)}
          time={timestampToUTC(loss.time)}
        />
        <AllyIcon corpID={loss.victim.corp} names={names} />
        <AllyIcon allyID={loss.victim.ally} names={names} />
      </div>
    )
  }

  render() {
    const { kmData, teamLosses } = this.props
    return (
      <div className={styles.team}>
        {kmData && kmData.map(km => {
          const matched = teamLosses.find(loss => loss.id === km.id)
          if (!matched) {
            return this.renderEmptyRow(km.id)
          }
          return this.renderLossRow(matched, km.id)
          // const time = timestampToUTC(loss.time)
          // return (
          //   <div>
          //     <span>{time}</span>
          //     &nbsp;
          //     <span>{loss.id}</span>
          //   </div>
          // )
        })}
      </div>
    )
  }
}
