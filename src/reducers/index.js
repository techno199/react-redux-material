import {combineReducers} from 'redux';
import {createActions, combineActions, handleActions} from 'redux-actions';
import authReducer from './authReducer';
import newsReducer from './newsReducer';

const defaultState = {
    isDialogOpened: false,
    isModalOpened: false
}

export const { openDialog, closeDialog, openModal, closeModal } = createActions({
    OPEN_DIALOG: () => ({ open: true }),
    CLOSE_DIALOG: () => ({ open: false }),
    OPEN_MODAL: () => ({ open: true }),
    CLOSE_MODAL: () => ({ open: false }),
});

const dialog = handleActions(
    {
        [combineActions(openDialog, closeDialog)]: (
            state,
            { payload: { open }}
        ) => {
            return { ...state, isDialogOpened: open }
        },
        [combineActions(openModal, closeModal)]: (
            state,
            { payload: { open }}
        ) => {
            return { ...state, isModalOpened: open }
        },
        
    },
    defaultState
);

export default combineReducers({
    dialog,
    auth: authReducer,
    news: newsReducer
});