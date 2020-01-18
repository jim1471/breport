/* eslint react/jsx-no-bind: off */
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Dialog, Switch } from 'components/common/blueprint'
import { updateSettings } from 'reducers/settings'
import styles from './styles.scss'

class ControlPanel extends Component {

  state = {
    settingsIsOpen: false,
  }

  handleOpenSettings = () => {
    this.setState({ settingsIsOpen: true })
  }

  handleCloseSettings = () => {
    this.setState({ settingsIsOpen: false })
  }

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
      <span className={styles.linkButton}>
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
      onReload, onReparse, onSaveBR, canSave, settings,
    } = this.props
    const { settingsIsOpen } = this.state
    const { ignoreDamageToStructures, countFightersAsSquad, showExtendedStatistics } = settings

    return (
      <div className={styles.headWrapper}>
        <div className={styles.head}>
          <div className={styles.buttons}>
            {this.renderBackButton()}
            {onReload &&
              <Fragment>
                &nbsp;
                <Button
                  loading={isLoading || error === 'processing'}
                  onClick={onReload}
                  text='Reload'
                />
              </Fragment>
            }
            {process.env.NODE_ENV === 'development' && false && onReparse &&
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

          <div className={styles.headRight}>
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

            <Button
              loading={saving}
              onClick={this.handleOpenSettings}
              icon='cog'
            />
          </div>
        </div>

        <Dialog
          icon='cog'
          title='Settings'
          isOpen={settingsIsOpen}
          onClose={this.handleCloseSettings}
          usePortal
          autoFocus
          enforceFocus
          canEscapeKeyClose
          canOutsideClickClose
          className='bp3-dark'
        >
          <div className='bp3-dialog-body'>
            <Switch
              large
              checked={ignoreDamageToStructures}
              onChange={() => this.props.updateSettings({ ignoreDamageToStructures: !ignoreDamageToStructures })}
            >
              Ignore damage to structures (affects char dmg stat and Inflicted Damage)
            </Switch>
            <Switch
              large
              checked={countFightersAsSquad}
              onChange={() => this.props.updateSettings({ countFightersAsSquad: !countFightersAsSquad })}
            >
              Count fighters as squad (affects ISK Lost and Efficiency)
            </Switch>
            <Switch
              large
              checked={showExtendedStatistics}
              onChange={() => this.props.updateSettings({ showExtendedStatistics: !showExtendedStatistics })}
            >
              Show extended statistics for pilots
            </Switch>
          </div>
        </Dialog>

        {error &&
          this.renderError(error)
        }
      </div>
    )
  }
}

const mapDispatchToProps = { updateSettings }
const mapStateToProps = ({ settings }) => ({ settings })

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
