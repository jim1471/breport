import React, { Component } from 'react'
import { Spinner as BpSpinner } from 'components/common/blueprint'
import styles from './styles.scss'


export default class Spinner extends Component {
  render() {
    return (
      <div className={styles.spinnerContainer}>
        <BpSpinner size='60' {...this.props} />
      </div>
    )
  }
}
