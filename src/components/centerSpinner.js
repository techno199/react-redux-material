import React, { Component } from 'react'
import { CircularProgress, withStyles } from '../../node_modules/@material-ui/core';

const defaultSpinnerSize = 40;

const styles = theme => ({
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  spinner: {
    position: 'absolute'
  }
});

class CenterSpinner extends Component {
  render() {
    const { classes } = this.props;
    let spinnerSize = this.props.size ? this.props.size : defaultSpinnerSize;
    let style;

    style  = {
      left: `calc(50% - ${spinnerSize / 2}px)`,
      top: `calc(50% - ${spinnerSize / 2}px)`
    }
    
    

    return (
      <div className={classes.spinnerContainer}>
        <CircularProgress {...this.props} classes={{}} className={classes.spinner} style={style}/>
      </div>
    )
  }
}

export default withStyles(styles)(CenterSpinner);