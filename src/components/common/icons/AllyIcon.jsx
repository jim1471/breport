import React, { PureComponent } from 'react'
import cn from 'classnames'
import styles from './styles.scss'


const EmptyImg = () => (
  <div className={cn(styles.iconCont, styles.empty)}>
    <div className={styles.emptyIcon} />
  </div>
)

export default class AllyIcon extends PureComponent {

  getTooltipContent() {
    const { allyID, corpID, names } = this.props
    if (!names) return null

    if (process.env.NODE_ENV === 'production') {
      return allyID
        ? `${names.allys[allyID]}`
        : `corporation: ${names.corps[corpID]}`
    }
    return allyID
      ? `${allyID}: ${names.allys[allyID]}`
      : `corp-${corpID}: ${names.corps[corpID]}`
  }

  render() {
    const { allyID, corpID, mini } = this.props
    if (!allyID && !corpID) return <EmptyImg />

    const iconUrl = allyID
      ? `https://images.evetech.net/alliances/${allyID}/logo?size=64`
      : `https://images.evetech.net/corporations/${corpID}/logo?size=64`
    const alt = allyID
      ? `allyID-${allyID}`
      : `corpID-${corpID}`

    return (
      <div className={cn(styles.iconCont, mini && styles.mini)} title={this.getTooltipContent()}>
        <img alt={alt} src={iconUrl} className={styles.icon} />
      </div>
    )
  }
}
