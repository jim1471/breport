import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { DateInput } from '@blueprintjs/datetime'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import styles from './styles.scss'

const FORMAT = 'yyyy-MM-dd HH:mm:ss'

const timePickerProps = {
  autoFocus: true,
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
  const now = new Date()
  now.setHours(now.getHours(), 0, 0, 0)
  return now
}

const DateInputComponent = ({ onChange }) => {
  const currentHour = getNowDatetime()
  const [datetime, setDatetime] = useState(currentHour)

  useEffect(() => {
    onChange(toUTCTimestamp(currentHour))
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
        timePickerProps={timePickerProps}
        formatDate={formatDate}
        parseDate={parseDate}
        showActionsBar
        closeOnSelection={false}
        todayButtonText='Now'
        placeholder='YYYY-MM-DD hh:mm:ss'
      />
    </div>
  )
}

export default DateInputComponent
