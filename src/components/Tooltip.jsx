import React, { Component } from 'react'
import { Tooltip as BpTooltip } from '@blueprintjs/core/lib/esm/components/tooltip/tooltip'

export default class Tooltip extends Component {
  render() {
    return (
      <BpTooltip {...this.props} usePortal={false} />
    )
  }
}
