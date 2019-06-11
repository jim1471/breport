import React, { Component } from 'react'
import cn from 'classnames'
import startsWith from 'lodash/startsWith'
import { connect } from 'react-redux'
import { addInputRelated } from 'reducers/battlereport'
import { InputGroup, Button } from 'components/common/blueprint'
import DateTimeInput from 'components/common/DateTimeInput'
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
    start: '',
    end: '',
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
    console.log('string:', string)
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
    const { system, start, end, relateds } = this.state
    if (relateds.length >= 10) {
      console.error('no more relateds pls') // eslint-disable-line
      return
    }
    const related = `/api/kills/solarSystemID/${system[1] + 30000000}/startTime/${start}/endTime/${end}/`
    console.log('related:', related)
    relateds.push(related)
    this.setState({ relateds: [...relateds] })
    this.props.addInputRelated(related)
  }

  handleDateTimeUpdate = (start, end) => {
    console.log(start, end)
    this.setState({ start, end })
  }

  renderHelper() {
    const { system, start, end } = this.state
    const sysID = system ? system[1] + 30000000 : '?'
    const startValid = !start.includes('?')
    const endValid = !end.includes('?')
    const isValid = system && startValid && endValid
    return (
      <div className={cn(styles.helper, isValid && styles.valid)}>
        {`/${sysID}/startTime/${start}/endTime/${end}/`}
      </div>
    )
  }

  render() {
    const { SYSTEMS_DATA, inputRelateds } = this.props
    const { system, string, matched, start, end } = this.state
    const value = system
      ? system[0]
      : string

    const isValid = system && start && end
    console.log('isValid', isValid, system, start, end)
    console.log('inputRelateds length:', inputRelateds.length)

    return (
      <div className={styles.card}>
        {this.renderHelper()}
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
              large
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

        <div className={styles.label}>
          Start date and time
        </div>

        <DateTimeInput onUpdate={this.handleDateTimeUpdate} />

        &nbsp;

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
