import { createActions, handleActions } from 'redux-actions';

export const fetchAuth = (email, password) => dispatch => {
  dispatch(requestAuth());
  let promise = new Promise((resolve, reject) => setTimeout(resolve, 1200));

  promise
      .then(() => {
        dispatch(receiveAuth());
        dispatch(setAdminRights());
      },
      error => {
        dispatch(failureAuth());
      });
  
    return promise;
}

export const fetchLogout  = () => dispatch => {
  dispatch(requestLogout());
  let promise = new Promise(resolve => setTimeout(resolve, 1200))
  promise
    .then(() => {
      dispatch(receiveLogout());
    },
    error => {
      dispatch(failureLogout());
    });
  
    return promise;
}

export const fetchSignup = (email, password) => dispatch => {
  dispatch(requestSignup());
  let promise = new Promise((resolve, reject) => setTimeout(resolve, 1200));
  promise
    .then(() => {
      dispatch(receiveSignup());
    },
    error => {
      dispatch(failureSignup());
    });

  return promise;
}

const defaultState = {
  isFetching: false,
  isAuthenticated: false,
  isFetchingLogout: false,
  isAdmin: false,
  isFetchingSignup: false
}

export const {
  requestAuth,
  receiveAuth,
  failureAuth,
  requestLogout,
  receiveLogout,
  failureLogout,
  setAdminRights,
  removeAdminRights,
  requestSignup,
  receiveSignup,
  failureSignup
} = createActions({
  REQUEST_AUTH: null,
  RECEIVE_AUTH: null,
  FAILURE_AUTH: null,
  REQUEST_LOGOUT: null,
  RECEIVE_LOGOUT: null,
  FAILURE_LOGOUT: null,
  SET_ADMIN_RIGHTS: null,
  REMOVE_ADMIN_RIGHT: null,
  REQUEST_SIGNUP: null,
  RECEIVE_SIGNUP: null,
  FAILURE_SIGNUP: null
});

export const authReducer = handleActions({
  [requestAuth]: state => ({ ...state, isFetching: true }),
  [receiveAuth]: state => ({ ...state, isFetching: false, isAuthenticated: true }),
  [failureAuth]: state => ({ ...state, isFetching: false }),
  [requestLogout]: state => ({ ...state, isFetchingLogout: true }),
  [receiveLogout]: state => ({ ...state, isAuthenticated: false, isFetchingLogout: false, isAdmin: false }),
  [failureLogout]: state => ({ ...state, isFetchingLogout: false }),
  [setAdminRights]: state => ({ ...state, isAdmin: true }),
  [removeAdminRights]: state => ({ ...state, isAdmin: false }),
  [requestSignup]: state => ({ ...state, isFetchingSignup: true }),
  [receiveSignup]: state => ({ ...state, isFetchingSignup: false }),
  [failureSignup]: state => ({ ...state, isFetchingSignup: false })
},
  defaultState
);

export default authReducer;