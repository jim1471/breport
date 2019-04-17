import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getBR } from 'reducers/battlereport'
import { getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import styles from './styles.scss'

// /br/5cb7a1bca236fcd1190f23e0
class BattleReportPage extends Component {

  constructor(props) {
    super(props)

    const { params: { brID } } = this.props
    this.state = {
      brID,
    }
  }

  componentDidMount() {
    const { brID } = this.state
    if (!brID) {
      browserHistory.push('/')
    } else {
      this.props.getBR(brID)
    }
  }

  componentDidUpdate(prevProps) {
    const { br } = this.props
    if (prevProps.br !== br) {
      console.log('br:', br)
      // this.props.
    }
  }

  render() {
    return (
      <div className={styles.root}>
        BattleReportPage
      </div>
    )
  }

}

const mapDispatchToProps = { getBR, getRelatedData, getRelatedDataStub, parseData }
const mapStateToProps = ({ related, battlereport }) => ({
  brID: battlereport.brID,
  br: battlereport.br,
  data: related.kmData || [],
  // teams: related.teams,
  // names: related.involvedNames,
  // kmLoading: related.kmLoading,
})
export default connect(mapStateToProps, mapDispatchToProps)(BattleReportPage)
