import React, { Component, Fragment } from 'react'
import cn from 'classnames'
import startsWith from 'lodash/startsWith'

import RelatedService from 'api/RelatedService'
import { InputGroup, Button, Icon } from 'components/common/blueprint'
import { getDurationStr } from 'utils/FormatUtils'
import routerHistory from 'utils/routerHistory'
import BrPrepareInfo from '../BrPrepareInfo'
import DateInputComponent from '../DateInputComponent'
import styles from './styles.scss'

const MAX_BATTLE_DURATION = 24 * 60 * 60 // 86400

const DropdownItem = ({ item, onSelect }) => {
  function handleSelect() {
    onSelect(item.system)
  }
  return (
    <div className={styles.item} onClick={handleSelect}>
      {item.name}
    </div>
  )
}

class InputSystems extends Component {

  state = {
    string: '',
    system: null,
    matched: [],
    startTS: 0,
    endTS: 0,
    relateds: [],
  }

  getMatchedSystems(str) {
    const { SYSTEMS_DATA } = this.props
    const matched = SYSTEMS_DATA.systems.filter(system => startsWith(system[0].toLowerCase(), str))
    return matched.slice(0, 5).map(system => ({
      id: system[1],
      name: `${system[0]} / ${SYSTEMS_DATA.regions[system[2]]}`,
      system,
    }))
  }

  handleSystemChange = event => {
    const string = event.target.value
    if (string) {
      const matched = this.getMatchedSystems(string.toLowerCase())
      this.setState({ string, matched, system: null })
    } else {
      this.setState({ string: '', matched: [], system: null })
    }
  }

  handleSelectItem = system => {
    this.setState({ system, string: '', matched: [] })
  }

  handleSubmit = () => {
    const { system, startTS, endTS, relateds } = this.state
    if (relateds.length >= 10) {
      console.error('Maximum 10 relateds allowed.') // eslint-disable-line
      return
    }
    const related = {
      systemID: system[1] + 30000000,
      start: startTS,
      end: endTS,
      // url: `/related-killmails/${system[1] + 30000000}/${startTS}/${endTS}`,
    }
    relateds.push(related)
    this.setState({ relateds: [...relateds], system: null })
  }

  handleStartChange = startTS => {
    this.setState({ startTS })
  }

  handleEndChange = endTS => {
    this.setState({ endTS })
  }

  handleRemove = ({ systemID }) => {
    const { relateds } = this.state
    this.setState({ relateds: relateds.filter(rel => rel.systemID !== systemID) })
  }

  validate() {
    const { system, startTS, endTS, relateds } = this.state
    const systemID = system ? system[1] + 30000000 : '?'
    const duration = (endTS || 0) - (startTS || 0)

    let isValid = false
    let validationStr = ''
    const systemAlreadyAdded = relateds.find(rel => rel.systemID === systemID)

    if (system && systemAlreadyAdded) {
      validationStr = `System ${system[0]} already added`
    }
    if (endTS <= startTS) {
      validationStr = 'End Time must be greater than Start Time'
    }
    if (endTS && startTS && duration > MAX_BATTLE_DURATION) {
      validationStr = 'Maximum Battle duration is 24hr'
    }
    if (!system) {
      validationStr = 'Input name of the System'
    }
    if (!endTS) {
      validationStr = 'Input End Time'
    }
    if (!startTS) {
      validationStr = 'Input Start Time'
    }

    if (!validationStr) {
      isValid = true
      validationStr = `Ready. Battle duration: ${getDurationStr(endTS, startTS)}`
    }

    const resultJsx = (
      <div className={cn(styles.helper, isValid && styles.valid)}>
        {isValid && <Icon iconSize={16} icon='tick-circle' intent='success' />}
        {!isValid && <Icon iconSize={16} icon='delete' intent='danger' />}
        <div>{validationStr}</div>
      </div>
    )
    return [isValid, resultJsx]
  }

  renderInputPanel() {
    const { SYSTEMS_DATA } = this.props
    const { system, string, matched } = this.state
    const value = system
      ? system[0]
      : string

    const [isValid, validation] = this.validate()

    return (
      <div className={styles.card}>

        {validation}

        <div className={styles.flexWrapper}>

          <div>
            <div className={styles.label}>
              <Icon iconSize={16} icon='globe-network' intent='primary' />
              &nbsp;
              System
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.systemInputGroup}>
                {system &&
                  <div className={styles.regionPlaceholder}>
                    <span className={styles.systemHidden}>{value}</span>
                    &nbsp;
                    <span>{SYSTEMS_DATA.regions[system[2]]}</span>
                  </div>
                }
                <InputGroup
                  className={cn('bp3-fill', styles.systemInput)}
                  value={value}
                  placeholder='Enter system'
                  onChange={this.handleSystemChange}
                />
                {matched.length > 0 &&
                  <div className={styles.dropdown}>
                    <div className={styles.overlay}>
                      {matched.map(item => (
                        <DropdownItem
                          item={item}
                          onSelect={this.handleSelectItem}
                          key={item.id}
                        />
                      ))}
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <div>
            <div className={styles.label}>
              <Icon iconSize={16} icon='time' intent='primary' />
              &nbsp;
              Start date time (ET)
            </div>
            <DateInputComponent onChange={this.handleStartChange} />
          </div>

          <div>
            <div className={styles.label}>
              <Icon iconSize={16} icon='time' intent='primary' />
              &nbsp;
              End date time (ET)
            </div>
            <DateInputComponent onChange={this.handleEndChange} />
          </div>
        </div>

        <br />

        <Button
          text='ADD'
          intent={isValid ? 'success' : 'danger'}
          disabled={!isValid}
          onClick={this.handleSubmit}
        />
      </div>
    )
  }

  createBattleReport = () => {
    const { relateds } = this.state
    this.setState({ isLoading: true })
    console.log('relateds:', relateds)
    RelatedService.createBR(relateds)
      .then(({ data }) => {
        if (data && data.status === 'success') {
          if (process.env.NODE_ENV === 'development') {
            console.log('created BR data:', data)
          }
          if (data.brID && data.ukey) {
            localStorage.setItem(data.brID, data.ukey)
          }
          routerHistory.push(`/br/${data.brID}`)
        }
        this.setState({ isLoading: false })
      })
      .catch(err => {
        console.error(err)
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { relateds, isLoading } = this.state
    const isValid = relateds && relateds.length > 0

    return (
      <Fragment>
        {this.renderInputPanel()}

        <BrPrepareInfo
          relateds={relateds}
          onRemove={this.handleRemove}
        />

        <br />
        <br />

        <Button
          large
          text='Create'
          intent={isValid ? 'primary' : 'danger'}
          disabled={!isValid}
          loading={isLoading}
          onClick={this.createBattleReport}
        />
      </Fragment>
    )
  }
}

export default InputSystems
