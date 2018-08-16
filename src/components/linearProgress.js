import React, { Component } from 'react'
import { withStyles, LinearProgress } from '@material-ui/core';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});

class CustomLinearProgress extends Component {
  render() {
    const { classes } = this.props;

    return (
      <LinearProgress className={classes.root} />
    )
  }
}

export default withStyles(styles)(CustomLinearProgress);