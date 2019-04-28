import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getBR, setStatus } from 'reducers/battlereport'
import { brParseTeams, getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import { Spinner } from 'components'
import Report from 'pages/Report'
import styles from './styles.scss'

// http://localhost:3200/br/5cc501e9fb679941931e38d1
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
    const { br, involvedNames } = this.props
    if (prevProps.br !== br && !br.isLoading && !br.error) {
      const brData = (br.relateds || [])[0]
      if (brData) {
        console.log('relateds:', brData)
      } else {
        console.log('br:', br)
      }
    }
    if (prevProps.involvedNames.isLoading && !involvedNames.isLoading) {
      this.props.setStatus('names fetched')
      this.props.brParseTeams()
    }
  }

  render() {
    const { status, br, teams, teamsLosses, router } = this.props
    const brData = (br.relateds || [])[0]
    return (
      <div className={styles.root}>

        <div>BattleReportPage</div>
        {status &&
          <div>Status: <span>{status}</span></div>
        }
        <hr />
        {br.isLoading &&
          <Spinner />
        }
        {teams && teamsLosses &&
          <Report
            teams={teams}
            isLoading={false}
            reportType='plane'
            routerParams={router.params}
          />
        }
      </div>
    )
  }

}

const mapDispatchToProps = { getBR, setStatus, brParseTeams, getRelatedData, getRelatedDataStub, parseData }
const mapStateToProps = ({ names, related, battlereport }) => ({
  involvedNames: names.involvedNames,
  status: battlereport.status,
  br: battlereport.br,
  saving: battlereport.saving,
  teams: related.teams,
  teamsLosses: related.teamsLosses,
})
export default connect(mapStateToProps, mapDispatchToProps)(BattleReportPage)
