import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import MainMenuItems from './mainMenuItems';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { IconButton } from '../../node_modules/@material-ui/core';

const styles = theme => ({
  list: {
    width: 250,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    height: '100%'
  }
});

class mainMenuDrawer extends React.Component {
  handleClose = () => {
    this.props.onClose && this.props.onClose();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Drawer open={this.props.open} onClose={this.handleClose} classes={{paper: classes.drawerPaper}}>
          <div className={classes.list}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleClose}>
                {
                  <ChevronLeftIcon />
                }
              </IconButton>
            </div>
            <Divider />
            <MainMenuItems />
          </div>
        </Drawer>
      </div>
    );
  }
}

mainMenuDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(mainMenuDrawer);