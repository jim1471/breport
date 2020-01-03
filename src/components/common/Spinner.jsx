import React from 'react'
import cn from 'classnames'
import { Spinner as BpSpinner } from 'components/common/blueprint'
import styles from './styles.scss'


const Spinner = ({ small, ...rest }) => (
  <div className={cn(styles.spinnerContainer, small && styles.small)}>
    <BpSpinner
      size={small ? 30 : 60}
      {...rest}
    />
  </div>
)

export default Spinner
