import React, { Component } from 'react'
import TeamInvolved from './TeamInvolved'


class TeamDamage extends Component {

  state = {
    data: null,
    sortedData: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
        sortedData: [...nextProps.data].sort((a, b) => b.dmg - a.dmg),
      }
    }
    return null
  }

  render() {
    const { sortedData } = this.state
    return (
      <TeamInvolved {...this.props} data={sortedData} />
    )
  }
}

export default TeamDamage
