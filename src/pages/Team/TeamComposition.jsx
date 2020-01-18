import React, { Component, Fragment } from 'react'
import cn from 'classnames'
// import startsWith from 'lodash/startsWith'
import AllyIcon from 'icons/AllyIcon'
import styles from './styles.scss'


function addMember(result, key) {
  if (key) {
    if (result[key]) {
      result[key] += 1
    } else {
      result[key] = 1
    }
  }
}

function getAllyCharsCount(allyComposition) {
  return Object.keys(allyComposition)
    .reduce((count, corpID) => count + allyComposition[corpID], 0)
}

function groupMembers(data) {
  const members = {
    unaffiliated: {},
  }
  data.forEach(ship => {
    // if (startsWith(ship.charID, 'structure')) {
    //   // skip
    // } else
    if (!ship.allyID) {
      addMember(members.unaffiliated, ship.corpID)
    } else {
      members[ship.allyID] = members[ship.allyID] || {}
      addMember(members[ship.allyID], ship.corpID)
    }
  })
  const allys = Object.keys(members).sort((allyA, allyB) => {
    if (allyB === 'unaffiliated') return -1
    if (allyA === 'unaffiliated') return 1
    const countA = getAllyCharsCount(members[allyA])
    const countB = getAllyCharsCount(members[allyB])
    return countB - countA
  })
  return {
    members,
    allys,
  }
}

const Ally = ({ id, name, chars, names }) => (
  <div className={styles.ally}>
    {id !== 'unaffiliated' &&
      <Fragment>
        <AllyIcon allyID={id} names={names} />
        <a
          className={styles.link}
          href={`https://zkillboard.com/alliance/${id}/`}
          target='_blank' rel='noopener noreferrer'
        >
          {`(${chars}) ${name}`}
        </a>
      </Fragment>
    }
    {id === 'unaffiliated' &&
      <div>{`(${chars}) ${name}`}</div>
    }
  </div>
)

const Corp = ({ id, name, chars, names }) => (
  <div className={styles.corp}>
    <AllyIcon mini corpID={id} names={names} />
    <a
      className={styles.link}
      href={`https://zkillboard.com/corporation/${id}/`}
      target='_blank' rel='noopener noreferrer'
    >
      {`(${chars}) ${name}`}
    </a>
  </div>
)


export default class TeamComposition extends Component {

  state = {
    members: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      const { data } = nextProps
      const { members, allys } = groupMembers(data)
      return {
        data,
        members,
        allys,
      }
    }
    return null
  }

  render() {
    const { members, allys } = this.state
    const { names } = this.props
    return (
      <div className={cn(styles.team, styles.composition)}>
        {members && allys.map(allyID => {
          const allyName = names.allys[allyID] || allyID || 'Unaffiliated Corporations'
          const allyCharsCount = getAllyCharsCount(members[allyID])
          if (allyCharsCount === 0) return null
          const corps = Object.keys(members[allyID]).sort((corpA, corpB) => {
            const countA = members[allyID][corpA]
            const countB = members[allyID][corpB]
            return countB - countA
          })

          return (
            <div className={styles.member} key={allyID}>
              <Ally
                key={allyID}
                id={allyID}
                name={allyName}
                chars={allyCharsCount}
                names={names}
              />
              <div className={styles.corps}>
                {corps.map(corpID => {
                  const corpName = names.corps[corpID] || corpID
                  const charsCount = members[allyID][corpID]
                  return (
                    <Corp
                      key={corpID}
                      id={corpID}
                      name={corpName}
                      chars={charsCount}
                      names={names}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
