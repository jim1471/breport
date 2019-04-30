import React, { Component } from 'react'
import styles from './styles.scss'

export default class Footer extends Component {
  render() {
    return (
      <div className={styles.footer}>
        <div>
          <span>All EVE related materials are property of</span>
          <a href='https://www.ccpgames.com' target='_blank' rel='noopener noreferrer'>
            CCP Games
          </a>
        </div>
        <a href='https://github.com/maullerz/breport' target='_blank' rel='noopener noreferrer'>
          GitHub
        </a>
      </div>
    )
  }
}
