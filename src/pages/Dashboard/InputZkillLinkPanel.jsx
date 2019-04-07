import React, { Component } from 'react'
import classnames from 'classnames'
import startsWith from 'lodash/startsWith'
import { browserHistory } from 'react-router'
import { InputGroup, Button } from '@blueprintjs/core'
import styles from './styles.scss'


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
      <div className={classnames(styles.card, styles.zkill)}>
        <InputGroup
          value={zlink}
          leftIcon='link'
          placeholder='Enter zkillboard related link'
          onChange={this.handleZlinkChange}
        />
        <div className={styles.cardRow}>
          <div>Related:</div>
          &nbsp;
          <div className={relatedLink ? styles.matchedLink : ''}>
            {relatedLink || '?'}
          </div>
          {relatedLink &&
            <span className={styles.matchedSystem}>
              &nbsp;
              {getSystemName(relatedLink)}
            </span>
          }
        </div>
        <Button
          disabled={!relatedLink}
          intent='primary'
          fill={false}
          icon='list-columns'
          rightIcon='arrow-right'
          onClick={this.handleGetReport}
        >
          Get report
        </Button>
      </div>
    )
  }
}
