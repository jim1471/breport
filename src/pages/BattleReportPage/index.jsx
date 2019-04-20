import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getBR } from 'reducers/battlereport'
import { getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import { Spinner } from 'components'
import Report from 'pages/Report'
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
    if (prevProps.br !== br && !br.isLoading && !br.error) {
      const brData = (br.relateds || [])[0]
      if (brData) {
        console.log('relateds:', brData)
      } else {
        console.log('br:', br)
      }
    }
  }

  render() {
    const { br, router } = this.props
    const brData = (br.relateds || [])[0]
    return (
      <div className={styles.root}>
        BattleReportPage
        <hr />
        {br.isLoading &&
          <Spinner />
        }
        {false && brData &&
          <Report
            teams={brData.teams}
            isLoading={false}
            reportType='plane'
            routerParams={router.params}
          />
        }
      </div>
    )
  }

}

const mapDispatchToProps = { getBR, getRelatedData, getRelatedDataStub, parseData }
const mapStateToProps = ({ related, battlereport }) => ({
  br: battlereport.br,
  saving: battlereport.saving,
  data: related.kmData || [],
  // teams: related.teams,
  // names: related.involvedNames,
  // kmLoading: related.kmLoading,
})
export default connect(mapStateToProps, mapDispatchToProps)(BattleReportPage)
