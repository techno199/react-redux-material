import React, { Component } from 'react'
import { ListItem, List, ListItemText, withStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const styles = theme => ({
  link: {
    textDecoration: 'none'
  },
  active: {
    backgroundColor: 'rgba(0,0,0,.08)'
  },
  listItem:{
    backgroundColor: 'inherit'
  }
})

class MainMenuItems extends Component {
  render() {
    const { classes } = this.props;

    return (
      <List>
        <NavLink exact activeClassName={classes.active}  to='/' className={classes.link}>
          <ListItem button className={classes.listItem}>
            <ListItemText primary='News'/>
          </ListItem>
        </NavLink>
      </List>
    )
  }
}

export default withStyles(styles)(MainMenuItems);