import React, { Component } from 'react'
import cn from 'classnames'
import startsWith from 'lodash/startsWith'
import { connect } from 'react-redux'

import { addInputRelated } from 'reducers/battlereport'
import { InputGroup, Button } from 'components/common/blueprint'
import DateInputComponent from '../DateInputComponent'
import styles from './styles.scss'


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
    startTS: Date.now(),
    endTS: Date.now(),
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
    const url = `/related-killmails/${system[1] + 30000000}/${startTS}/${endTS}`
    relateds.push(url)
    this.setState({ relateds: [...relateds] })
    this.props.addInputRelated(url)
  }

  handleStartChange = startTS => {
    this.setState({ startTS })
  }

  handleEndChange = endTS => {
    this.setState({ endTS })
  }

  renderHelper() {
    const { system, startTS, endTS } = this.state
    const sysID = system ? system[1] + 30000000 : '?'
    const startValid = startTS > 0
    const endValid = endTS > 0 && endTS > startTS
    const isValid = system && startValid && endValid
    return (
      <div className={cn(styles.helper, isValid && styles.valid)}>
        {`/${sysID}/${startTS || '?'}/${endTS || '?'}`}
      </div>
    )
  }

  render() {
    const { SYSTEMS_DATA } = this.props
    const { system, string, matched, startTS, endTS } = this.state
    const value = system
      ? system[0]
      : string

    const isValid = system && startTS && endTS && endTS > startTS

    return (
      <div className={styles.card}>

        {this.renderHelper()}

        <div className={styles.flexWrapper}>

          <div>
            <div className={styles.label}>
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
                  leftIcon='globe-network'
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
              Start date time (ET)
            </div>
            <DateInputComponent onChange={this.handleStartChange} />
          </div>

          <div>
            <div className={styles.label}>
              End date time (ET)
            </div>
            <DateInputComponent onChange={this.handleEndChange} />
          </div>
        </div>

        <br />

        <Button
          text='ADD'
          intent='primary'
          disabled={!isValid}
          onClick={this.handleSubmit}
        />
      </div>
    )
  }
}

const mapDispatchToProps = { addInputRelated }
const mapStateToProps = ({ battlereport }) => ({
  inputRelateds: battlereport.inputRelateds,
})
export default connect(mapStateToProps, mapDispatchToProps)(InputSystems)
