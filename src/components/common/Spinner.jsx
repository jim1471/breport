import React, { Component } from 'react'
import cn from 'classnames'
import { Spinner as BpSpinner } from 'components/common/blueprint'
import styles from './styles.scss'


export default class Spinner extends Component {
  render() {
    const { small } = this.props
    const size = small ? 30 : 60
    return (
      <div className={cn(styles.spinnerContainer, small && styles.small)}>
        <BpSpinner size={size} {...this.props} />
      </div>
    )
  }
}
