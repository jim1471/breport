import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Link } from 'react-router-dom'

import { SYSTEMS_DATA } from 'data/constants'
import { Icon } from 'components/common/blueprint'
import { Footer } from 'widgets'
import InputSystems from './InputSystems'
import styles from './styles.scss'

function CreateBattleReport() {
  if (!SYSTEMS_DATA.systems) return null

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <h1>Create Battle Report</h1>
        <h4>
          <Icon iconSize={16} icon='issue' intent='warning' />
          &nbsp;
          Killmails presented currently only for 2020 year.
        </h4>

        <Link to='/'>Back</Link>

        <InputSystems SYSTEMS_DATA={SYSTEMS_DATA} />

        <div className={styles.empty} />
        <Footer />
      </div>
    </div>
  )
}

export default hot(CreateBattleReport)
