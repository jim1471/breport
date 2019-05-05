import React, { Component } from 'react'
import startsWith from 'lodash/startsWith'
import { browserHistory } from 'react-router'
import { InputGroup, Button } from 'components/common/blueprint'
import styles from './styles.scss'

// zkillboard.com/related/31002496/201903230200/
export default class InputZkillLinkPanel extends Component {
  state = {
    zlink: '',
    relatedLink: '',
  }

  handleZlinkChange = event => {
    const link = event.target.value
    if (link || link === '') {
      this.setState({ zlink: link })
      const isZkill = link.includes('zkillboard.com')
      const isRelated = link.includes('/related')
      if (isZkill && isRelated) {
        let relatedLink = link.replace('https://', '').replace('http://', '')
        relatedLink = relatedLink.replace('zkillboard.com', '')
        if (startsWith(relatedLink, '/related/')) {
          this.setState({ relatedLink })
          return
        }
      }
    }
    this.setState({ relatedLink: '' })
  }

  handleGetReport = () => {
    const { relatedLink } = this.state
    if (relatedLink) {
      browserHistory.push(relatedLink)
    }
  }

  render() {
    const { zlink, relatedLink } = this.state
    const { getSystemName } = this.props
    return (
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <span>Related:</span>
          <span className={relatedLink ? styles.matchedLink : ''}>
            {relatedLink || '?'}
          </span>
          {relatedLink &&
            <span className={styles.matchedSystem}>
              {getSystemName(relatedLink)}
            </span>
          }
        </div>
        <InputGroup
          value={zlink}
          leftIcon='link'
          placeholder='Enter zkillboard related link'
          onChange={this.handleZlinkChange}
        />
        <Button
          disabled={!relatedLink}
          intent='primary'
          fill={false}
          icon='list-columns'
          onClick={this.handleGetReport}
        >
          Analyze related
        </Button>
      </div>
    )
  }
}
