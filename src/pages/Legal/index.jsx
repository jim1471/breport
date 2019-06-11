import React, { Component } from 'react'
import { Link } from 'react-router'
import { Navbar, Icon } from 'components/common/blueprint'
import { Footer } from 'widgets'
import styles from './styles.scss'

const LEGAL_TEXT = 'EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to EVSCO to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, EVSCO. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.'

export default class Legal extends Component {
  renderLogo() {
    return (
      <div className={styles.heading}>
        <div className={styles.logo}>
          <Link to='/'>
            <img alt='breport-logo' src='/icons/favicon-32x32.png' />
          </Link>
        </div>
        <span className={styles.iconText}>
          Legal
        </span>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <Navbar fixedToTop>
          <div className={styles.headWrapper}>
            <Navbar.Group>
              <Navbar.Heading>
                {this.renderLogo()}
              </Navbar.Heading>

              <Navbar.Divider />
            </Navbar.Group>

            <Navbar.Group className='bp3-align-right'>
              <Link to='/'>
                <Icon icon='link' iconSize={16} />
                <span className={styles.iconText}>
                  Home
                </span>
              </Link>
            </Navbar.Group>
          </div>
        </Navbar>
        <div className={styles.body}>
          {LEGAL_TEXT}
        </div>
        <Footer />
      </div>
    )
  }
}
