import React, { Component } from 'react'
import { Spinner as BpSpinner } from 'components/common/blueprint'


export default class SmallSpinner extends Component {
  render() {
    return (
      <BpSpinner size='60' {...this.props} />
    )
  }
}
