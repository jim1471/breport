import React, { Component } from 'react'
import classnames from 'classnames'
import { parse, format } from 'date-fns'
import { FormGroup } from '@blueprintjs/core/lib/esm/components/forms/formGroup'
import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput'
import { Suggest } from '@blueprintjs/select/lib/esm/components/select/suggest'
import { INPUT, intentClass, INTENT_PRIMARY } from '@blueprintjs/core/lib/esm/common/classes'
import { NumericInput } from '@blueprintjs/core'
// import { Card, Menu, MenuItem } from '@blueprintjs/core'
import styles from './styles.scss'

const DATA = require('utils/data/systems.json')

const DATE_FORMAT = 'YYYY-MM-DD'
// const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'
const MAX_DATE = new Date()
const MIN_DATE = new Date(2018, 1, 1)
const formatDate = date => (date ? format(date, DATE_FORMAT) : '')
const parseDate = str => (str ? parse(str, DATE_FORMAT) : str)

const Menu = ({ children }) => (
  <ul className='bp3-menu'>{children}</ul>
)

const MenuItem = ({ item, disabled, onClick }) => (
  <li onClick={onClick}>
    <a tabIndex='-1' className={classnames('bp3-menu-item', disabled && 'bp3-disabled')}>
      <div className='bp3-text-overflow-ellipsis bp3-fill'>
        {item
          ? `${item[0]} (${DATA.regions[item[2]]})`
          : 'System not found.'
        }
      </div>
    </a>
  </li>
)

const EmptyMenu = () => (
  <Menu><MenuItem disabled /></Menu>
)

function areItemsEqual(itemA, itemB) {
  return itemA[0].toLowerCase() === itemB[0].toLowerCase()
}


export default class InputRelatedPanel extends Component {

  state = {
    selected: null,
    startDate: new Date(),
    startHour: 0,
    endHour: 0,
    // endDate: null,
  }

  renderItem = (item, { handleClick, modifiers }) => (
    <MenuItem active={modifiers.active} text={item[0]} item={item} key={item[0]} onClick={handleClick} />
  )

  renderItems = ({ filteredItems, query, itemsParentRef, renderItem, ...rest }) => {
    // console.log('rest:', rest)
    if (!filteredItems || filteredItems.length === 0) return <EmptyMenu />
    if (!query) return null

    const items = filteredItems.slice(0, 9)
    return (
      <Menu ulRef={itemsParentRef}>
        {items.map(item => renderItem(item))}
      </Menu>
    )
  }

  renderInputValue = item => (item ? item[0] : '')

  filterItem = (query, item) => {
    const [name, systemID, regionIndex] = item
    return `${name.toLowerCase()}`.indexOf(query.toLowerCase()) === 0
    // return `${name.toLowerCase()} ${DATA.regions[regionIndex].toLowerCase()}`.indexOf(query.toLowerCase()) >= 0
  }

  handleItemSelect = selected => {
    // console.log('selected:', selected)
    this.setState({ selected })
  }

  handleError = error => {
    console.error('DateInput:', error) // eslint-disable-line
  }

  handleDateChange = date => {
    this.setState({ startDate: date })
  }

  render() {
    const { selected, startDate, startHour } = this.state
    return (
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Suggest
            activeItem={selected}
            items={DATA.systems}
            itemsEqual={areItemsEqual}
            itemRenderer={this.renderItem}
            itemPredicate={this.filterItem}
            itemListRenderer={this.renderItems}
            inputValueRenderer={this.renderInputValue}
            openOnKeyDown={false}
            onItemSelect={this.handleItemSelect}
            popoverProps={{ minimal: true }}
            inputProps={{ placeholder: 'Solar system' }}
          />
          <DateInput
            showActionsBar
            // timePrecision='minute'
            value={parseDate(startDate)}
            formatDate={formatDate}
            parseDate={parseDate}
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            onChange={this.handleDateChange}
            // disabled={false}
            // onFocus={this.handleFocus}
            // onBlur={this.handleBlur}
            // inputProps={{ onKeyDown: this.handleKeyDown }}
            placeholder='YYYY-MM-DD'
            onError={this.handleError}
          />
        </div>
        <div className={styles.cardRow}>
          <FormGroup
            label='Start hour'
            className={styles.inputHour}
          >
            <NumericInput
              leftIcon='time'
              value={startHour}
            />
          </FormGroup>
          <FormGroup
            label='End hour'
            className={styles.inputHour}
          >
            <NumericInput
              leftIcon='time'
              value={startHour}
              fill={false}
            />
          </FormGroup>
        </div>
      </div>
    )
  }
}
