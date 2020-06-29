import { hot } from 'react-hot-loader'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import routerHistory from 'utils/routerHistory'
import { getBR, setStatus } from 'reducers/battlereport'
import { brParseTeams, brParseNew, getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import { Spinner } from 'components'
import { ControlPanel, BrInfo, BrRelatedInfo, Footer } from 'widgets'
import Report from 'pages/Report'
import styles from './styles.scss'

class BattleReportPage extends Component {

  constructor(props) {
    super(props)

    const { params: { brID } } = this.props
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      brID,
    }
  }

  componentDidMount() {
    const { brID } = this.state
    if (!brID) {
      routerHistory.push('/')
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
      if (process.env.NODE_ENV === 'development') {
        console.log('br:', br)
      }
    }
    if (prevProps.involvedNames.isLoading && !involvedNames.isLoading) {
      this.props.setStatus('names fetched')
      if (br.new) {
        this.props.brParseNew()
      } else {
        this.props.brParseTeams()
      }
    }
    if (!prevProps.teamsLosses && teamsLosses) {
      if (br.new) {
        this.props.setStatus(`${br.kmData && br.kmData.length} killmails`)
      } else {
        const killmailsCount = br.relateds.reduce((sum, related) => sum + related.kmsCount, 0)
        this.props.setStatus(`${killmailsCount} killmails`)
      }
    }
  }

  reloadBr = () => {
    const { brID } = this.state
    this.props.getBR(brID)
  }

  renderBrInfos() {
    const { br } = this.props
    return (
      <div className={styles.brInfoRoot}>
        {br.relateds.map(relData => (
          <BrRelatedInfo
            {...relData}
            key={relData.systemID}
            brPage
          />
        ))}
      </div>
    )
  }

  render() {
    const { status, teams, teamsLosses, params, br, involvedNames } = this.props
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
            {br.new
              ? this.renderBrInfos()
              : <BrInfo routerParams={params} />
            }
            <Report
              teams={teams}
              isLoading={false}
              reportType='plane'
              routerParams={params}
            />
          </Fragment>
        }
        <Footer />
      </div>
    )
  }

}

const mapDispatchToProps = {
  getBR, setStatus, brParseTeams, brParseNew, getRelatedData, getRelatedDataStub, parseData,
}
const mapStateToProps = ({ names, related, battlereport }, { match: { params } }) => ({
  involvedNames: names.involvedNames,
  status: battlereport.status,
  br: battlereport.br,
  saving: battlereport.saving,
  teams: related.teams,
  teamsLosses: related.teamsLosses,
  params,
})
const ConnectedBRPage = connect(mapStateToProps, mapDispatchToProps)(BattleReportPage)

export default hot(module)(ConnectedBRPage)
