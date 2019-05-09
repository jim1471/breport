import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import isEqual from 'lodash/isEqual'
import { getRelatedData, getRelatedDataStub, parseData, setBrInfo } from 'reducers/related'
import { Spinner, ControlPanel, BrInfo, TabsPanel, Footer } from 'components'
import RelatedService from 'api/RelatedService'
import Report from 'pages/Report'
import styles from './styles.scss'


class RelatedPage extends Component {

  state = {
    saving: false,
  }

  componentDidMount() {
    const { names, params: { systemID, time }, relatedSystemID, relatedDatetime } = this.props
    const isNewRelated = parseInt(systemID, 10) !== relatedSystemID || time !== relatedDatetime
    if (names.isLoading || isNewRelated) {
      this.fetchData()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { names } = this.props
    if (names.isLoading && !nextProps.names.isLoading) {
      this.props.parseData()
    }
  }

  handleReparse = () => {
    this.props.parseData()
  }

  fetchData = () => {
    const { params: { systemID, time }, isStub } = this.props
    if (isStub) {
      console.warn('THIS IS STUB. Params:', systemID, time)
      this.props.getRelatedDataStub(systemID, time)
    } else {
      console.log('fetching:', systemID, time)
      this.props.getRelatedData(systemID, time)
    }
  }

  handleSaveBR = () => {
    const { params: { systemID, time }, isStub } = this.props
    if (isStub || this.state.saving) return
    const { teams, ...rest } = this.props
    if (process.env.NODE_ENV === 'development') {
      console.log('teams:', teams, rest.location.pathname)
    }

    this.setState({ saving: true }, async () => {
      RelatedService.saveComposition(teams, systemID, time)
        .then(({ data }) => {
          this.setState({ saving: false })
          this.props.setBrInfo([{
            relatedKey: `${systemID}/${time}`,
            teams,
          }])
          browserHistory.push(`/br/${data.result.id}`)
        })
        .catch(err => {
          this.setState({ saving: false })
          console.error('err:', err)
        })
    })
  }

  isTeamsChanged() {
    const { teams, origTeams } = this.props
    if (!teams) {
      return false
    }
    return !isEqual(teams, origTeams)
  }

  renderContent() {
    const { reportType, saving } = this.state
    const { error, stillProcessing, data = [], teams, names, router, kmLoading } = this.props
    const isError = error || names.error
    // const isLoading = names.isLoading || kmLoading
    const isLoading = kmLoading

    let header = ''
    if (stillProcessing || isError === 'processing') {
      header = 'Related data: processing...'
    } else if (isError) {
      header = 'Related data: failed to fetch.'
    } else if (isLoading) {
      header = 'Related data: loading...'
    } else {
      header = `Related data: ${data.length} killmails`
    }

    return (
      <Fragment>
        <ControlPanel
          header={header}
          isLoading={isLoading}
          error={isError}
          saving={saving}
          onReload={this.fetchData}
          onReparse={this.handleReparse}
          onSaveBR={this.handleSaveBR}
          canSave={this.isTeamsChanged()}
        />
        {!isError && !isLoading &&
          <Fragment>
            <BrInfo routerParams={router.params} />
            <TabsPanel />
            <Report
              teams={teams}
              isLoading={isLoading}
              reportType={reportType}
              routerParams={router.params}
            />
          </Fragment>
        }
        {isLoading &&
          <Spinner />
        }
        <Footer />
      </Fragment>
    )
  }

  render() {
    return (
      <div className={styles.appRoot}>
        {this.renderContent()}
      </div>
    )
  }
}

const mapDispatchToProps = { getRelatedData, getRelatedDataStub, parseData, setBrInfo }
const mapStateToProps = ({ related, names }) => ({
  isStub: related.isStub,
  error: related.error,
  data: related.kmData || [],
  teams: related.teams,
  origTeams: related.origTeams,
  names: names.involvedNames,
  kmLoading: related.kmLoading,
  stillProcessing: related.stillProcessing,
  relatedSystemID: related.systemID,
  relatedDatetime: related.datetime,
})

export default connect(mapStateToProps, mapDispatchToProps)(RelatedPage)
