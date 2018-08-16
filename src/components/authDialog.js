import React, { Component } from 'react'
import { DialogTitle, Dialog, TextField, DialogActions, Button, DialogContent, withStyles, FormHelperText } from '@material-ui/core';
import PropTypes from 'prop-types';
import { fetchAuth } from '../reducers/authReducer';
import { connect } from 'react-redux';
import LinearProgress from './linearProgress';

const styles = theme => ({
  inputField: {
    minWidth: 400,
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.down('xs')]: {
      minWidth: 200
    }
  },
  dialogPaper: {
    minHeight: 170
  },
  progressContainer: {
    height: 5
  }
});

class AuthDialog extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    errorFetchingAuth: false
  }

  handleChange = key => event => {
    this.setState({ [key]: event.target.value });
  }

  handleLogin = () => {
    if (!this.state.email || 
      !this.state.password) {
        this.setState({
          error: 'This fields must not be empty'
        });
        return;
      }
    else {
      this.setState({
        error: ''
      });
    }
    this.setState({ errorFetchingAuth: false });
    this.props.requestLogin(this.state.email, this.state.password)
      .then(
        res => {
          this.setState({ email: '', password: ''});
          this.handleClose();
        }, 
        error => {
          this.setState({ errorFetchingAuth: true });
        });
        
    this.props.onLogin && this.props.onLogin();
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
  }

  render() {
    const { classes, isAuthFetching } = this.props;
    const { error, errorFetchingAuth } = this.state;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle>Authentication</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label='Email address'
              type='email'
              value={this.state.email}
              fullWidth
              onChange={this.handleChange('email')}
              className={classes.inputField}
            />
            <TextField
              label='Password'
              type='password'
              value={this.state.password}
              fullWidth
              onChange={this.handleChange('password')}
              className={classes.inputField}
            />
            {
              error &&
                <FormHelperText error>{error}</FormHelperText>
            }
            {
              errorFetchingAuth &&
                <FormHelperText error>An error occured while trying to authorize</FormHelperText>
            }   
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={this.handleLogin}>Login</Button>
            <Button variant='outlined' onClick={this.handleClose}>Close</Button>
          </DialogActions>
          {
            isAuthFetching && (
              <LinearProgress />
            )
          }
        </Dialog>
      </div>
    )
  }
}

AuthDialog.propTypes = {
  open: PropTypes.bool,
  onLogin: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAuthFetching: state.auth.isFetching
})

const mapDispatchToProps = dispatch => ({
  requestLogin: (email, password) => {
    return dispatch(fetchAuth(email, password));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AuthDialog));