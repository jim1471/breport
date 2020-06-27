import React, { useState } from 'react'
import cx from 'classnames'
import { DateInput } from '@blueprintjs/datetime'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import styles from './styles.scss'

const FORMAT = 'yyyy-MM-dd HH:mm'

const timePickerProps = {
  autoFocus: true,
  precision: 'minute',
  showArrowButtons: true,
  selectAllOnFocus: true,
}

const toUTCTimestamp = date => {
  const jsTimestamp = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  )
  return jsTimestamp / 1000
}

const DateInputComponent = ({ onChange }) => {
  const [datetime, setDatetime] = useState(new Date())

  function formatDate(date) {
    return format(date, FORMAT)
  }

  function parseDate(dateStr) {
    return parse(dateStr, FORMAT, new Date())
  }

  function handleChange(value) {
    console.log('value:', value)
    setDatetime(value)
    onChange(toUTCTimestamp(value))
  }

  return (
    <div className={cx('bp3-dark', styles.wrapper)}>
      <DateInput
        icon='time'
        value={datetime}
        onChange={handleChange}
        maxDate={new Date()}
        timePickerProps={timePickerProps}
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder='YYYY-MM-DD hh:mm'
        showActionsBar
        closeOnSelection={false}
      />
    </div>
  )
}

export default DateInputComponent
