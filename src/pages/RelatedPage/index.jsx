import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons'
import { Radio } from '@blueprintjs/core/lib/esm/components/forms/controls'
import { RadioGroup } from '@blueprintjs/core/lib/esm/components/forms/radioGroup'
import { getRelatedData, getRelatedDataStub, parseData } from 'reducers/related'
import RelatedService from 'api/RelatedService'
import Report from 'pages/Report'
import styles from './styles.scss'


class RelatedPage extends Component {

  state = {
    // reportType: 'grouped',
    reportType: 'plane',
    saving: false,
  }

  componentDidMount() {
    this.handleClick()
  }

  componentWillReceiveProps(nextProps) {
    const { names } = this.props
    if (names.isLoading && !nextProps.names.isLoading) {
      this.props.parseData()
    }
  }

  handleReportTypeChange = event => {
    this.setState({ reportType: event.currentTarget.value })
  }

  handleReparse = () => {
    this.props.parseData()
  }

  handleClick = () => {
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
    console.log('teams:', teams, rest.location.pathname)

    this.setState({ saving: true }, async () => {
      RelatedService.saveComposition(teams, `${systemID}/${time}`)
        .then(({ data }) => {
          this.setState({ saving: false })
          browserHistory.push({
            pathname: rest.location.pathname,
            search: `?br=${data.id}`,
          })
          console.log('data', data)
        })
        .catch(err => {
          this.setState({ saving: false })
          console.error('err:', err)
        })
    })
  }

  handleGetBR = () => {
    const { query: { br } } = this.props.location
    if (!br || this.state.saving) return
    console.log('br', br)
    this.setState({ saving: true }, async () => {
      RelatedService.getComposition(br)
        .then(({ data }) => {
          this.setState({ saving: false })
          console.log('data', data)
        })
        .catch(err => {
          this.setState({ saving: false })
          console.error('err:', err)
        })
    })
  }

  renderError(error) {
    if (error === 'processing') {
      return (
        <div className={styles.errWrapper}>
          <div style={{ color: '#888' }}>Still processing...</div>
        </div>
      )
    }
    let errStr = error
    if (typeof error === 'object') {
      const errCode = (error.code || error.statusCode) ? `${error.code || error.statusCode}: ` : ''
      errStr = `${errCode}${error.error || error.message}`
    }
    return (
      <div className={styles.errWrapper}>
        <div style={{ color: '#888' }}>Something went wrong</div>
        <div>{errStr}</div>
      </div>
    )
  }

  renderContent() {
    const { reportType, saving } = this.state
    const { data = [], teams, names, router, kmLoading } = this.props
    const isError = names.error
    const isLoading = !names || names.isLoading || kmLoading

    let header = ''
    if (isError === 'processing') {
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
        <div className={styles.headWrapper}>
          <div className={styles.head}>
            <div className={styles.controls}>
              <div className={styles.header}>{header}</div>
              <div className={styles.buttons}>
                <span>
                  <Link to='/'>
                    <Button
                      icon='double-chevron-left'
                      title='return to Dashboard'
                      small
                    />
                  </Link>
                </span>
                &nbsp;
                <Button
                  loading={names.isLoading || kmLoading || isError === 'processing'}
                  onClick={this.handleClick}
                  text='Reload'
                  small
                />
                {process.env.NODE_ENV === 'development' &&
                  <Fragment>
                    &nbsp;
                    <Button
                      loading={isLoading}
                      onClick={this.handleReparse}
                      text='Reparse'
                      small
                    />
                    &nbsp;
                    <Button
                      loading={isLoading || saving}
                      onClick={this.handleSaveBR}
                      text='Save Composition'
                      small
                    />
                    &nbsp;
                    <Button
                      loading={isLoading || saving}
                      onClick={this.handleGetBR}
                      text='get BR'
                      small
                    />
                  </Fragment>
                }
              </div>
            </div>
            {!isError && !isLoading &&
              <RadioGroup
                inline
                className={styles.radioGrp}
                onChange={this.handleReportTypeChange}
                selectedValue={reportType}
              >
                <Radio label='Grouped' value='grouped' />
                <Radio label='Plane' value='plane' />
              </RadioGroup>
            }
          </div>
          <div className={styles.separator} />
          {isError &&
            this.renderError(names.error)
          }
        </div>
        {!isError &&
          <Report
            teams={teams}
            isLoading={isLoading}
            reportType={reportType}
            routerParams={router.params}
          />
        }
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

const mapDispatchToProps = { getRelatedData, getRelatedDataStub, parseData }
const mapStateToProps = ({ br }) => ({
  isStub: br.isStub,
  data: br.kmData || [],
  teams: br.teams,
  names: br.involvedNames,
  kmLoading: br.kmLoading,
})

export default connect(mapStateToProps, mapDispatchToProps)(RelatedPage)
