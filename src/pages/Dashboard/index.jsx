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


// const stub = [
//   ['/related/30002833/201905040200/', 'The Kalevala Expanse'],
//   ['/related/30000478/201904120800/', 'capital brawl'],
//   ['/related/30004662/201904051900/', '4 titans and nyx'],
//   ['/related/30000511/201904051000/', '1077 killmails'],
//   ['/related/31002071/201903290500/', ''],
//   ['/related/30005259/201903281600/', ''],
//   ['/related/31000743/201903291600/', 'Marginis Fortzar'],
//   ['/related/30000842/201903240200/', ''],
//   ['/related/30001975/201903212200/', 'Fortizar in PB'],
//   ['/related/31002496/201903230200/', 'WH'],
//   ['/related/30000483/201903030500/', 'komodo'],
//   ['/related/30002435/201901161000/', '300 dreads'],
//   ['/related/30005176/201903161600/', ''],
//   ['/related/30000688/201902112000/', ''],
//   ['/related/30001111/201903161900/', ''],
//   ['/related/30005268/201903141400/', ''],

//   ['/related/30004828/201903091600/', ''],
//   ['/related/30000444/201903101600/', ''],
//   ['/related/30000694/201810121800/', ''],
//   ['/related/30000694/201810102000/', ''],
//   ['/related/30001029/201810312100/', ''],
//   ['/related/30000726/201811102000/', ''],
//   ['/related/30000721/201811201800/', ''],
//   ['/related/30000691/201811241900/', ''],
//   ['/related/30000657/201901171900/', ''],
//   ['/related/30003853/201902161000/', ''],
// ]

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
    const createdAt = (new Date(item.createdAt)).toUTCString()
    return (
      <div key={key} className={styles.item}>
        {false &&
          <div className={styles.linkCell}>
            {path}
          </div>
        }
        <div className={styles.systemCell}>
          <Link to={path}>
            {this.getSystemName(item.systemID)}
          </Link>
          {false && <div>{createdAt}</div>}
          {false && <div>{`${item.datetime} - ${parseZkillDatetime(item.datetime)}`}</div>}
          <div>{parseZkillDatetime(item.datetime)}</div>
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
      <div className={styles.examples}>
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
