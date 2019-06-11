import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTab } from 'reducers/tabs'
import { Tabs, Tab } from 'components/common/blueprint'
import styles from './styles.scss'

class TabsPanel extends Component {

  handleTabChange = currTab => {
    const { onTabChange } = this.props
    onTabChange && onTabChange(currTab)
    this.props.setTab(currTab)
  }

  render() {
    const { currTab } = this.props
    return (
      <div className={styles.root}>
        <Tabs
          id='general'
          selectedTabId={currTab}
          onChange={this.handleTabChange}
        >
          <Tab id='involved' title='Involved' />
          <Tab id='summary' title='Summary' />
          <Tab id='timeline' title='Timeline' />
          <Tab id='damage' title='Damage' />
        </Tabs>
      </div>
    )
  }
}

const mapDispatchToProps = { setTab }
const mapStateToProps = ({ tabs }) => ({
  currTab: tabs.currTab,
})
export default connect(mapStateToProps, mapDispatchToProps)(TabsPanel)
