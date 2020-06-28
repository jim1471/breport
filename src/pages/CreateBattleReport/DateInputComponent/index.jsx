import React, { useState, useEffect } from 'react'
import cx from 'classnames'
// import { DateInput } from '@blueprintjs/datetime'
import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput'
import { parse, format, parseISO } from 'date-fns'
import styles from './styles.scss'

const FORMAT = 'yyyy-MM-dd HH:mm:ss'

const dayPickerProps = {}

const popoverProps = {
  hasBackdrop: true,
  // position: 'bottom',
  position: 'top',
}

const timePickerProps = {
  autoFocus: false,
  precision: 'second',
  showArrowButtons: true,
  selectAllOnFocus: true,
  canClearSelection: false,
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

const getNowDatetime = () => {
  const utcStr = new Date().toISOString()
    .replace('T', ' ')
    .replace('Z', '')
  const now = parseISO(utcStr)
  now.setHours(now.getHours(), 0, 0, 0)
  return now
}

const DateInputComponent = ({ onChange }) => {
  const currentUTCHour = getNowDatetime()
  const [datetime, setDatetime] = useState(currentUTCHour)

  useEffect(() => {
    onChange(toUTCTimestamp(currentUTCHour))
  }, [])

  function formatDate(date) {
    return format(date, FORMAT)
  }

  function parseDate(dateStr) {
    return parse(dateStr, FORMAT, new Date())
  }

  function handleChange(value) {
    const newValue = value || getNowDatetime()
    setDatetime(newValue)
    onChange(toUTCTimestamp(newValue))
  }

  return (
    <div className={cx('bp3-dark', styles.wrapper)}>
      <DateInput
        icon='time'
        value={datetime}
        onChange={handleChange}
        maxDate={new Date()}
        dayPickerProps={dayPickerProps}
        popoverProps={popoverProps}
        timePickerProps={timePickerProps}
        formatDate={formatDate}
        parseDate={parseDate}
        showActionsBar
        closeOnSelection={false}
        todayButtonText='Locale Date'
        clearButtonText='ET hour'
        placeholder='YYYY-MM-DD hh:mm:ss'
      />
    </div>
  )
}

export default DateInputComponent
