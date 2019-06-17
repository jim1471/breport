import React, { Component, Fragment } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getBR, setStatus } from 'reducers/battlereport'
import { brParseTeams, getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import { Spinner } from 'components'
import { ControlPanel, BrInfo, TabsPanel, Footer } from 'widgets'
import Report from 'pages/Report'
import styles from './styles.scss'

// http://localhost:3200/br/5cc513267996865911654dca
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
      return
    }
    const { teamsLosses } = this.props
    if (!teamsLosses) {
      this.props.getBR(brID)
    }
  }

  componentDidUpdate(prevProps) {
    const { br, involvedNames, teamsLosses } = this.props
    if (prevProps.br !== br && !br.isLoading && !br.error) {
      const brData = (br.relateds || [])[0]
      if (process.env.NODE_ENV === 'development') {
        if (brData) {
          console.log('relateds:', brData)
        } else {
          console.log('br:', br)
        }
      }
    }
    if (prevProps.involvedNames.isLoading && !involvedNames.isLoading) {
      this.props.setStatus('names fetched')
      this.props.brParseTeams()
    }
    if (!prevProps.teamsLosses && teamsLosses) {
      const killmailsCount = br.relateds.reduce((sum, related) => sum + related.kmsCount, 0)
      this.props.setStatus(`${killmailsCount} killmails`)
    }
  }

  reloadBr = () => {
    const { brID } = this.state
    this.props.getBR(brID)
  }

  render() {
    const { status, teams, teamsLosses, router, br, involvedNames } = this.props
    const isLoading = br.isLoading || involvedNames.isLoading
    return (
      <div className={styles.root}>
        <ControlPanel
          header={status}
          isLoading={isLoading}
          // error={}
          // saving={saving}
          onReload={process.env.NODE_ENV === 'development' && this.reloadBr}
          // onReparse={this.handleReparse}
          // onSaveBR={this.handleSaveBR}
          // canSave={this.isTeamsChanged()}
        />

        {!teamsLosses &&
          <Spinner />
        }

        {teams && teamsLosses &&
          <Fragment>
            <BrInfo routerParams={router.params} />
            <TabsPanel />
            <Report
              teams={teams}
              isLoading={false}
              reportType='plane'
              routerParams={router.params}
            />
          </Fragment>
        }
        <Footer />
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
