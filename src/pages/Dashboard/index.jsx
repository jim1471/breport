import React, { Component, Fragment } from 'react'
import { Link } from 'react-router'
import { Footer } from 'components'
// import InputRelatedPanel from './InputRelatedPanel'
import InputZkillLinkPanel from './InputZkillLinkPanel'
import styles from './styles.scss'

const SYSTEMS_DATA = require('utils/data/systems.json')

const relateds = [
  ['/related/30000478/201904120800/', 'capital brawl'],
  ['/related/30004662/201904051900/', '4 titans and nyx'],
  ['/related/30000511/201904051000/', '1077 killmails'],
  ['/related/31002071/201903290500/', ''],
  ['/related/30005259/201903281600/', ''],
  ['/related/31000743/201903291600/', 'Marginis Fortzar'],
  ['/related/30000842/201903240200/', ''],
  ['/related/30001975/201903212200/', 'Fortizar in PB'],
  ['/related/31002496/201903230200/', 'WH'],
  ['/related/30000483/201903030500/', 'komodo'],
  ['/related/30002435/201901161000/', '300 dreads'],
  ['/related/30005176/201903161600/', ''],
  ['/related/30000688/201902112000/', ''],
  ['/related/30001111/201903161900/', ''],
  ['/related/30005268/201903141400/', ''],

  ['/related/30004828/201903091600/', ''],
  ['/related/30000444/201903101600/', ''],
  ['/related/30000694/201810121800/', ''],
  ['/related/30000694/201810102000/', ''],
  ['/related/30001029/201810312100/', ''],
  ['/related/30000726/201811102000/', ''],
  ['/related/30000721/201811201800/', ''],
  ['/related/30000691/201811241900/', ''],
  ['/related/30000657/201901171900/', ''],
  ['/related/30003853/201902161000/', ''],
]

class Dashboard extends Component {

  getSystemName(link) {
    const [systemID] = link.replace('/related/', '').split('/')
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return (
      <span>
        <span>{system[0]}</span>
        <span style={{ whiteSpace: 'nowrap' }}>{` (${region})`}</span>
      </span>
    )
  }

  renderExamples() {
    // if (process.env.NODE_ENV === 'development')
    return (
      <Fragment>
        <h1>Example Battle Reports:</h1>
        <table className='bp3-html-table'>
          <tbody>
            {relateds.map(path => (
              <tr key={path[0]}>
                <td className={styles.commentCell}>
                  <a
                    href={`http://zkillboard.com${path[0]}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Zkill
                  </a>
                </td>
                <td className={styles.linkCell}>
                  <Link to={path[0]}>{path[0]}</Link>
                </td>
                <td className={styles.systemCell}>
                  {this.getSystemName(path[0])}
                </td>
                <td className={styles.commentCell}>
                  {path[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <InputZkillLinkPanel getSystemName={this.getSystemName} />
          {this.renderExamples()}
          <Footer />
        </div>
      </div>
    )
  }

}

export default Dashboard
