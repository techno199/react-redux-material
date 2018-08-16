import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/draft-js/dist/Draft.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-roboto';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/';
import {Provider} from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';


const theme = createMuiTheme({
});

const logger = createLogger({})

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        logger
    )
);

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>, 
    document.getElementById('root'));
registerServiceWorker();
