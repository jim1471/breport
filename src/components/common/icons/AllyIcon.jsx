import React, { PureComponent } from 'react'
import cn from 'classnames'
import styles from './styles.scss'


const EmptyImg = () => (
  <div className={cn(styles.iconCont, styles.empty)}>
    <div className={styles.emptyIcon} />
  </div>
)

const Img = ({ alt, iconUrl, mini }) => (
  <img
    alt={alt}
    src={iconUrl}
    width={mini ? 16 : 32}
    className={styles.icon}
  />
)

export default class AllyIcon extends PureComponent {

  getTooltipContent() {
    const { allyID, corpID, names } = this.props
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
      ? `https://imageserver.eveonline.com/Alliance/${allyID}_64.png`
      : `https://imageserver.eveonline.com/Corporation/${corpID}_64.png`
    const alt = allyID
      ? `allyID-${allyID}`
      : `corpID-${corpID}`

    const icon = <Img alt={alt} iconUrl={iconUrl} mini={mini} />

    if (mini) return icon

    return (
      <div className={styles.iconCont} title={this.getTooltipContent()}>
        {icon}
      </div>
    )
  }
}