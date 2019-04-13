import React, { Component } from 'react'
import { Spinner as BpSpinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner'

export default class Spinner extends Component {
  render() {
    return (
      <BpSpinner {...this.props} />
    )
  }
}
