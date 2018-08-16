import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
    root: { 
        flexGrow: 1
    },
    flex: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    switch: {
        marginLeft: theme.spacing.unit * 2
    }
});

class appBar extends React.Component {
    state = {
        auth: true,
        anchorEl: null,
    }

    handleChange = (event, checked) => {
        this.setState({
            auth: checked
        })
    }

    handleMenu = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        })
    }

    handleClose = () => {
        this.setState({
            anchorEl: null
        })
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <FormGroup className={classes.switch}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={auth}
                                onChange={this.handleChange}
                                aria-label='login-switch'
                            />
                        }
                        label={auth ? 'logout' : 'login'}
                    />
                </FormGroup>
                <AppBar position='static'>
                    <ToolBar>
                        <IconButton className={classes.menuButton} color='inherit' aria-label='Menu'>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='title' color='inherit' className={classes.flex}>
                            Photos
                        </Typography>
                        {
                            auth && (
                                <div>
                                    <IconButton
                                        aria-owns={open ? 'menu-appbar' : null}
                                        aria-haspopup='true'
                                        onClick={this.handleMenu}
                                        color='inherit'
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id='menu-appbar'
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                        open={open}
                                        onClose={this.handleClose}
                                    >
                                        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            )
                        }
                    </ToolBar>
                </AppBar>
            </div>

        )
    }
}

appBar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(appBar);
