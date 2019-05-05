import React, { Component } from 'react'
import cn from 'classnames'
import Loadable from 'react-loadable'
import startsWith from 'lodash/startsWith'
// import { browserHistory } from 'react-router'
import { InputGroup, NumericInput, Button } from 'components/common/blueprint'
import { Spinner } from 'components'
// import DatePicker from 'components/common/DatePicker'
import styles from './styles.scss'


const DatePicker = Loadable({
  loader: () => import(/* webpackChunkName: "DatePicker" */'components/common/DatePicker'),
  loading: () => <Spinner />,
})


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


export default class InputSystems extends Component {
  state = {
    string: '',
    system: null,
    matched: [],
    selectedDay: '',
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

  handleDaySelect = day => {
    this.setState({ selectedDay: day })
  }

  render() {
    const { SYSTEMS_DATA } = this.props
    const { system, string, matched, selectedDay } = this.state
    const value = system
      ? system[0]
      : string

    return (
      <div className={styles.card}>
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
          <DatePicker value={selectedDay} onDaySelect={this.handleDaySelect} />
        </div>

        <div className={styles.inputGroup}>
          <NumericInput
            className={cn(styles.numericInput, 'bp3-fixed')}
            large
            value={0}
            min={0}
            max={23}
            leftIcon='time'
            placeholder='Hour'
            onChange={null}
          />
          <NumericInput
            className={cn(styles.numericInput, 'bp3-fixed')}
            large
            value={0}
            min={0}
            max={59}
            leftIcon='time'
            placeholder='Minute'
            onChange={null}
          />
        </div>

        <Button text='btn' intent='primary' />
      </div>
    )
  }
}
