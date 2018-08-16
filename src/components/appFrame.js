import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Route, Switch } from 'react-router-dom';
import { Grid, Menu } from '../../node_modules/@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import AuthDialog from './authDialog';
import RegisterDialog from './registerDIalog';
import MainMenuDrawer from './mainMenuDrawer';
import NewsDetails from './newsDetails';
import { fetchLogout } from '../reducers/authReducer';
import { connect } from 'react-redux';
import CenterSpinner from './centerSpinner';
import NewsFeed from './newsFeed';

const circularProgressSize = 40;

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    width: '100%',
    minHeight: '100%'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  flex:{
    flexGrow: 1
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  account: {
    marginRight: 20,
    marginLeft: 'auto'
  },
  logoutButton: {
    position: 'relative',
  },
  logoutProgress: {
    position: 'absolute',
    left: `calc(50% - ${circularProgressSize / 2}px)`
  }
});

class AppFrame extends Component {
  state = {
    open: false,
    anchor: 'left',
    auth: false,
    anchorEl: null,
    authDialogOpen: false,
    registerDialogOpen: false
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  }

  handleDrawerClose = () => {
    this.setState({ open: false });
  }

  handleChangeAnchor = event => {
    this.setState({ anchor: event.target.value });
  }

  handleLogoutButton = () => {
    this.props.requestLogout()
      .then(() => {
        // Menu appearence depends on whether anchorEl is null
        this.setState({ anchorEl: null })
      })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleLoginButton = () => {
    this.setState({ authDialogOpen: true });
  }

  handleAuthDialogClose = () => {
    this.setState({ authDialogOpen: false });
  }

  handleRegisterDialogOpen = () => {
    this.setState({ registerDialogOpen: true });
  }

  handleRegisterDialogClose = () => {
    this.setState({ registerDialogOpen: false });
  }

  render() {
    const { classes, match, auth, isFetchingLogout } = this.props;
    const {  open, anchorEl, authDialogOpen, registerDialogOpen } = this.state;
    const openMenu = Boolean(anchorEl);

    let topicName;
    switch (match.params.topic){ 
      default: {
        topicName = 'News';
      }
    }

    return (
        <div className={classes.root}>
          <div className={classes.appFrame}> 
            <AppBar
              className={classes.appBar}
              position='fixed'
            >
              <Toolbar>
                <IconButton
                  color='inherit'
                  aria-label='open-drawer'
                  onClick={this.handleDrawerOpen}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant='title' color='inherit' noWrap className={classes.flex}>
                  {topicName}
                </Typography>
                <div>
                  {
                    auth ? (
                      <div>
                        <IconButton
                          aria-owns={open ? 'menu-appbar' : null}
                          aria-haspopup='true'
                          onClick={this.handleMenuOpen}
                          color='inherit'
                        >
                          <AccountCircle />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={this.handleMenuClose}
                        >
                          <MenuItem onClick={this.handleLogoutButton} className={classes.logoutButton}>
                            {
                              isFetchingLogout && 
                                //<CircularProgress size={circularProgressSize} className={classes.logoutProgress} />
                                <CenterSpinner />
                            }
                            <span>Logout</span>
                          </MenuItem>
                        </Menu>
                      </div>
                    )
                    : (
                      <div>
                        <Button color='inherit' onClick={this.handleLoginButton}>Login</Button>
                        <Button color='inherit' onClick={this.handleRegisterDialogOpen}>Sign Up</Button>
                      </div>
                    )
                  }
                </div>
              </Toolbar>
              <MainMenuDrawer open={this.state.open} onClose={this.handleDrawerClose}/>
            </AppBar>
            <main
              className={classes.content}
            >
              <div className={classes.drawerHeader} /> 
              <Grid container justify='center'>
                <Switch>
                  <Route exact path='/' component={NewsFeed} />
                  <Route path='/news/:newsId' component={NewsDetails} />
                </Switch>
              </Grid>
            </main>
          </div>
          <AuthDialog 
            open={authDialogOpen}  
            onClose={this.handleAuthDialogClose}
          />
          <RegisterDialog 
            open={registerDialogOpen} 
            onClose={this.handleRegisterDialogClose} 
          />
        </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth.isAuthenticated,
  isFetchingLogout: state.auth.isFetchingLogout
});

const mapDispatchToProps = dispatch => ({
  requestLogout: () => dispatch(fetchLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(AppFrame));