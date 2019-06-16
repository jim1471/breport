import React, { Component } from 'react'
import { Link } from 'react-router'
// import { Button } from 'components/common/blueprint'
import { BrInfo, Footer } from 'widgets'
import { SYSTEMS_DATA } from 'data/constants'
import { parseZkillDatetime } from 'utils/FormatUtils'
import RelatedService from 'api/RelatedService'
import InputZkillLinkPanel from './InputZkillLinkPanel'
import InputSystems from './InputSystems'
import styles from './styles.scss'


class Dashboard extends Component {

  state = {
    related: 'single',
    // related: 'multiple',
    relateds: [],
  }

  componentDidMount() {
    RelatedService.getRecentRelateds()
      .then(({ data }) => {
        console.log('recent data:', data[0])
        this.setState({ relateds: data })
      })
  }

  getSystemName(systemID) {
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return `${system[0]} (${region})`
  }

  toggleRelated = () => {
    this.setState(state => ({
      related: state.related === 'single' ? 'multiple' : 'single',
    }))
  }

  renderRecentRelated(item) {
    const key = `${item.systemID}/${item.datetime}`
    const path = `/related/${key}`
    const createdAt = (new Date(item.createdAt)).toLocaleString()
    return (
      <div key={key} className={styles.item}>
        <div className={styles.systemCell}>
          <Link to={path}>
            {this.getSystemName(item.systemID)}
          </Link>
          {false && <div>{`${item.datetime} - ${parseZkillDatetime(item.datetime)}`}</div>}
          <div>{parseZkillDatetime(item.datetime)}</div>
          <div className={styles.createdAt}>
            {`added: ${createdAt}`}
          </div>
        </div>
        <div className={styles.commentCell}>
          {`Killmails: ${item.kmsCount}`}
        </div>
      </div>
    )
  }

  renderRecent() {
    const { relateds } = this.state
    if (!relateds || relateds.length === 0) {
      return null
    }
    return (
      <div className={styles.recent}>
        <div>Recent Battle Reports:</div>
        {relateds.map(item => this.renderRecentRelated(item))}
      </div>
    )
  }

  renderPanel() {
    if (!SYSTEMS_DATA.systems) return null
    const { related } = this.state
    if (related === 'single') {
      return <InputZkillLinkPanel getSystemName={this.getSystemName} />
    }
    return (
      <div>
        <BrInfo dashboard />
        <InputSystems SYSTEMS_DATA={SYSTEMS_DATA} />
      </div>
    )
  }

  renderControls() {
    return null
    // const { related } = this.state
    // return (
    //   <div className={styles.controls}>
    //     <Button large active={related === 'single'} onClick={this.toggleRelated}>
    //       Single
    //     </Button>
    //     <Button large active={related === 'multiple'} onClick={this.toggleRelated}>
    //       Multiple
    //     </Button>
    //   </div>
    // )
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          {this.renderControls()}
          {this.renderPanel()}
          {this.renderRecent()}
          <Footer />
        </div>
      </div>
    )
  }

}

export default Dashboard
