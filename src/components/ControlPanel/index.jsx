import React, { Component, Fragment } from 'react'
import { Link } from 'react-router'
import { Button } from 'components/common/blueprint'
import styles from './styles.scss'

export default class ControlPanel extends Component {

  renderError(error) {
    if (error === 'processing') {
      return (
        <div className={styles.errWrapper}>
          <div style={{ color: '#888' }}>Still processing...</div>
        </div>
      )
    }
    let errStr = error
    if (typeof error === 'object') {
      const errCode = (error.code || error.statusCode) ? `${error.code || error.statusCode}: ` : ''
      errStr = `${errCode}${error.error || error.message}`
    }
    return (
      <div className={styles.errWrapper}>
        <div style={{ color: '#888' }}>Something went wrong</div>
        <div>{errStr}</div>
      </div>
    )
  }

  renderBackButton() {
    return (
      <span>
        <Link to='/'>
          <Button icon='double-chevron-left' title='return to Dashboard' small={false}>
            <span className={styles.backBtn}>Back</span>
          </Button>
        </Link>
      </span>
    )
  }

  render() {
    const {
      header, isLoading, error, saving,
      onReload, onReparse, onSaveBR, canSave,
    } = this.props
    return (
      <div className={styles.headWrapper}>
        <div className={styles.head}>
          <div className={styles.buttons}>
            {this.renderBackButton()}
            &nbsp;
            <Button
              loading={isLoading || error === 'processing'}
              onClick={onReload}
              text='Reload'
            />
            {process.env.NODE_ENV === 'development' &&
              <Fragment>
                &nbsp;
                <Button
                  loading={isLoading}
                  onClick={onReparse}
                  text='Reparse'
                />
              </Fragment>
            }
          </div>

          <div className={styles.header}>
            {header}
          </div>

          {canSave && !isLoading &&
            <Button
              loading={saving}
              onClick={onSaveBR}
              text='Save'
              icon='floppy-disk'
            />
          }
        </div>
        <div className={styles.separator} />
        {error &&
          this.renderError(error)
        }
      </div>
    )
  }
}
