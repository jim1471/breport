import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

import { Spinner } from 'components'
import { Button, Tabs, Tab, Icon } from 'components/common/blueprint'
import { Footer } from 'widgets'
import { SYSTEMS_DATA } from 'data/constants'
import { parseZkillDatetime, formatSum } from 'utils/FormatUtils'
import RelatedService from 'api/RelatedService'
import styles from './styles.scss'


class Dashboard extends Component {

  state = {
    currTab: 'recent',
    recentLoading: false,
  }

  componentDidMount() {
    // RelatedService.getRecentBattleReports()
    this.fetchRecentRelateds()
  }

  getRecentPromise() {
    const { currTab } = this.state
    switch (currTab) {
      case 'big':
        return RelatedService.getRecentRelatedsBig()
      case 'huge':
        return RelatedService.getRecentRelatedsHuge()
      case 'added':
        return RelatedService.getRecentlyAddedRelateds()
      case 'recent':
      default:
        return RelatedService.getRecentRelateds()
    }
  }

  getSystemNameFromLink = link => {
    const [systemID] = link.replace('/related/', '').split('/')
    return this.getSystemName(systemID)
  }

  getSystemName(systemID) {
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return `${system[0]} (${region})`
  }

  handleTabChange = currTab => {
    this.setState({ currTab }, this.fetchRecentRelateds)
  }

  toggleRelated = () => {
    this.setState(state => ({
      related: state.related === 'single' ? 'multiple' : 'single',
    }))
  }

  fetchRecentRelateds() {
    this.setState({ relateds: null, recentLoading: true })
    this.getRecentPromise().then(({ data }) => {
      this.setState({ relateds: data, recentLoading: false })
    }).catch(() => this.setState({ recentLoading: false }))
  }

  renderRecentRelated(item) {
    const key = `${item.systemID}/${item.datetime}`
    const path = `/related/${key}`
    const createdAt = new Date(item.createdAt)
    const relatedDate = parseZkillDatetime(item.datetime)
    const relatedDateFmt = relatedDate && relatedDate.toUTCString()
      .replace(':00:00', ':00').replace(':30:00', ':30').replace('GMT', 'ET')

    return (
      <div key={key} className={styles.item}>
        <div className={cx(styles.systemCell, styles.column)}>
          <Link to={path}>
            {this.getSystemName(item.systemID)}
          </Link>
          <div>{relatedDateFmt}</div>
        </div>
        <div className={styles.systemCell}>
          <div className={styles.distanceCell}>
            {`${formatDistanceToNow(relatedDate)} ago`}
          </div>
          <div className={styles.createdAt}>
            <span className={styles.createdAtLabel}>added </span>
            <span>{`${formatDistanceToNow(createdAt)} ago`}</span>
          </div>
        </div>
        <div className={styles.systemCell}>
          <div className={styles.statsCell}>
            <span>{`Total lost: ${formatSum(item.totalLost) || '?'},`}</span>
            <span>{`Killmails: ${item.kmsCount},`}</span>
            <span>{`Pilots: ${item.totalPilots},`}</span>
            <span>{`Viewed: ${item.viewed}`}</span>
          </div>
        </div>
      </div>
    )
  }

  renderRecent() {
    const { relateds, currTab, recentLoading } = this.state
    return (
      <div className={styles.recent}>
        <Tabs
          id='recent'
          selectedTabId={currTab}
          onChange={this.handleTabChange}
          animate={false}
        >
          <Tab id='recent' title='Recent Reports' />
          <Tab id='big' title='Recent >10kkk' />
          <Tab id='huge' title='Recent >100kkk' />
          <Tab id='added' title='Recently Added' />
        </Tabs>
        {recentLoading &&
          <div className={styles.spinnerWrapper}>
            <Spinner />
          </div>
        }
        {relateds &&
          relateds.map(item => this.renderRecentRelated(item))
        }
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool is for generating battle reports from killmails held on zKillboard.com.</h4>
          <h4>
            <Icon iconSize={16} icon='issue' intent='warning' />
            &nbsp;
            Killmails presented currently only for 2020 year.
          </h4>

          <Link to='/create' className={styles.createLink}>
            <Button large intent='primary' text='CREATE BATTLE REPORT' />
          </Link>

          {this.renderRecent()}

          <Footer />
        </div>
      </div>
    )
  }

}

export default hot(Dashboard)
