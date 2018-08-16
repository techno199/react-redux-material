import React, { Component } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormHelperText, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSignup, fetchAuth } from '../reducers/authReducer';
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
  loggingInContainer: {
    minWidth: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      minWidth: 200
    }
  }
});


class RegisterDialog extends Component {
  state = {
    email: '',
    password: '',
    repeatedPassword: '',
    error: '',
    errorFetchingSignup: false
  }

  handleChange = key => event => {
    this.setState({ [key]: event.target.value });
  }

  handleSignup = () => {
    if (this.state.password !== this.state.repeatedPassword) {
      // Dispatch request to server
      this.setState({ 
        error: 'Passwords are not the same'
      });
      return;
    }
    else if (!this.state.password || !this.state.email || !this.state.repeatedPassword) {
      this.setState({
        error: 'All fields must be filled'
      });
      return;
    }
    else {
      this.setState({
        error: ''
      });
    }

    this.setState({ errorFetchingSignup: false });
    this.props.fetchSignup(this.state.email, this.state.password)
      .then(() => {
        this.props.fetchAuth(this.state.email, this.state.password)
          .then(() => {
            this.setState({ email: '', password: '', repeatedPassword: '' });
            this.handleClose();
          },
          error => {

          });
      }, 
      error => {
        this.setState({ errorFetchingSignup: true });
      })
    this.props.onSignup && this.props.onSignup();
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
  }

  render() {
    const { classes, isFetchingSignup, isFetchingAuth } = this.props;
    const { error, errorFetchingSignup } = this.state;

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          classes={{
            paper: classes.dialogPaper
          }}
        >
          {
            isFetchingAuth ? (
              <DialogContent className={classes.loggingInContainer}>
                Logging in...
              </DialogContent>
            )
            : (
              <div>
                <DialogTitle>Registration</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    type='email'
                    label='Email'
                    value={this.state.email}
                    fullWidth
                    onChange={this.handleChange('email')}
                    className={classes.inputField}
                  />
                  <TextField
                    type='password'
                    label='Password'
                    value={this.state.password}
                    fullWidth
                    onChange={this.handleChange('password')}
                    className={classes.inputField}
                  />
                  <TextField
                    type='password'
                    label='Repeat password'
                    value={this.state.repeatedPassword}
                    fullWidth
                    onChange={this.handleChange('repeatedPassword')}
                    className={classes.inputField}
                  />
                  {
                    error &&
                      <FormHelperText error>{error}</FormHelperText>
                  }
                  {
                    errorFetchingSignup &&
                      <FormHelperText error>An error occured while trying to sign up</FormHelperText>
                  }
                </DialogContent>
                <DialogActions>
                  <Button variant='outlined' onClick={this.handleSignup}>Sign up</Button>
                  <Button variant='outlined' onClick={this.handleClose}>Close</Button>
                </DialogActions>
              </div>
            )
          }
          {
            (isFetchingSignup || isFetchingAuth) &&
              <LinearProgress />
          }
        </Dialog>
      </div>
    )
  }
}

RegisterDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSignup: PropTypes.func
}

const mapStateToProps = state => ({
  isFetchingSignup: state.auth.isFetchingSignup,
  isFetchingAuth: state.auth.isFetching
})

const mapDispatchToProps = dispatch => ({
  fetchSignup: (email, password) => dispatch(fetchSignup(email, password)),
  fetchAuth: (email, password) => dispatch(fetchAuth(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterDialog));