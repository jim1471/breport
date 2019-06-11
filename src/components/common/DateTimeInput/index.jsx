/* eslint react/sort-comp: off */
import React, { Component } from 'react'
import Loadable from 'react-loadable'
import cn from 'classnames'
import { Spinner } from 'components'
import { InputGroup, Icon } from 'components/common/blueprint'
import styles from './styles.scss'

const DatePicker = Loadable({
  loader: () => import(/* webpackChunkName: "DatePicker" */'components/common/DatePicker'),
  loading: () => <Spinner small />,
})

const format = value => (value < 10 || !value ? `0${value}` : `${value}`)

export default class DateTimeInput extends Component {
  state = {
    selectedDay: '',
    startHours: '0',
    startMinutes: '0',
    endHours: '0',
    endMinutes: '0',
  }

  componentDidMount() {
    this.updateDatetime()
  }

  onValueChange = (maxValue, stateKey) => event => {
    const { value } = event.target
    console.log('value:', value)
    // if (!value && value !== '0') {
    //   this.setState({ [stateKey]: '' }, this.updateDatetime)
    //   return
    // }
    const numValue = parseInt(value, 10)
    if ((numValue || numValue === 0) && !Number.isNaN(numValue)) {
      if (numValue < maxValue) {
        const strValue = numValue
        this.setState({ [stateKey]: strValue }, this.updateDatetime)
      }
    } else {
      this.setState({ [stateKey]: '' }, this.updateDatetime)
    }
  }

  handleStartHoursChange = this.onValueChange(24, 'startHours')

  handleStartMinutesChange = this.onValueChange(60, 'startMinutes')

  handleEndHoursChange = this.onValueChange(24, 'endHours')

  handleEndMinutesChange = this.onValueChange(60, 'endMinutes')

  handleDaySelect = day => {
    this.setState({ selectedDay: day }, this.updateDatetime)
  }

  updateDatetime() {
    const { selectedDay, startHours, startMinutes, endHours, endMinutes } = this.state
    const { onUpdate } = this.props
    if (selectedDay && onUpdate) {
      const start = `${selectedDay}${format(startHours)}${format(startMinutes)}`
      const end = `${selectedDay}${format(endHours)}${format(endMinutes)}`
      onUpdate(start, end)
    }
  }

  render() {
    const { selectedDay, startHours, startMinutes, endHours, endMinutes } = this.state
    return (
      <div className={styles.inputGroup}>
        <DatePicker
          value={selectedDay}
          onDaySelect={this.handleDaySelect}
        />
        <div className={styles.timeGroup}>
          <Icon iconSize={20} icon='time' />
          <InputGroup
            className={cn(styles.numericInput, 'bp3-fixed')}
            large min='0' max='23'
            type='number'
            value={format(startHours)}
            placeholder='Hrs'
            onChange={this.handleStartHoursChange}
          />
          <InputGroup
            className={cn(styles.numericInput, 'bp3-fixed')}
            large min='0' max='59'
            type='number'
            value={format(startMinutes)}
            placeholder='Mins'
            onChange={this.handleStartMinutesChange}
          />
        </div>
        <div className={styles.timeGroup}>
          <Icon iconSize={20} icon='time' />
          <InputGroup
            className={cn(styles.numericInput, 'bp3-fixed')}
            large min='0' max='23'
            type='number'
            value={format(endHours)}
            placeholder='Hrs'
            onChange={this.handleEndHoursChange}
          />
          <InputGroup
            className={cn(styles.numericInput, 'bp3-fixed')}
            large min='0' max='59'
            type='number'
            value={format(endMinutes)}
            placeholder='Mins'
            onChange={this.handleEndMinutesChange}
          />
        </div>


        {false && <Icon iconSize={32} icon='tick-circle' intent='success' />}
        {false && <Icon iconSize={32} icon='delete' intent='danger' />}
      </div>
    )
  }
}
