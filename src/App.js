import React from 'react';
import AppFrame from './components/appFrame';
import { Route } from 'react-router-dom';
import { withStyles } from '../node_modules/@material-ui/core';

const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1
    }
})

class App extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Route path='/:topic?' component={AppFrame} />
            </div>
          )
    }
}

export default withStyles(styles)(App);
