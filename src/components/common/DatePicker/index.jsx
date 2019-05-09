import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dateFnsParse from 'date-fns/parse'
import dateFnsFormat from 'date-fns/format'
import { DateUtils } from 'react-day-picker'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import './styles.scss'

const FORMAT = 'DD/MM/YYYY'

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale })
}


export default class DatePicker extends Component {

  static propTypes = {
    selectedDay: PropTypes.string,
    onDaySelect: PropTypes.func,
  }

  static defaultProps = {
    selectedDay: dateFnsFormat(new Date(), FORMAT),
  }

  handleDayChange = day => {
    this.props.onDaySelect(day)
  }

  render() {
    const { selectedDay } = this.props
    return (
      <DayPickerInput
        showOverlay
        keepFocus={false}

        value={selectedDay}
        onDayChange={this.handleDayChange}
        dayPickerProps={{
          todayButton: 'Today',
          showOutsideDays: true,
        }}
        format={FORMAT}
        placeholder={FORMAT}
        parseDate={parseDate}
        formatDate={formatDate}
      />
    )
  }
}
