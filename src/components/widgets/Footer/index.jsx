import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'

export default class Footer extends Component {

  linkToLegal(text) {
    return (
      <Link to='/legal'>
        {text}
      </Link>
    )
  }

  render() {
    return (
      <div className={styles.footer}>
        <div>
          <span>All {this.linkToLegal('EVE related materials')} are property of</span>
          <a href='https://www.ccpgames.com' target='_blank' rel='noopener noreferrer'>
            CCP Games
          </a>
        </div>
        <div>
          {this.linkToLegal('CCP Copyright Notice')}
        </div>
        <div className={styles.links}>
          <a href='https://github.com/maullerz/breport' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
          &nbsp;
          <a href='https://discord.gg/HyPnAU7' target='_blank' rel='noopener noreferrer'>
            Discord
          </a>
        </div>
      </div>
    )
  }
}
