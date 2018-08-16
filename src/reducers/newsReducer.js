import {createActions, handleActions} from 'redux-actions';
import { defaultNewsData } from './defaultNewsData';


export const fetchNews = () => (dispatch, getState) => {
  dispatch(requestNews());
  let fetchedNews =  getState().news.news.sort((news1, news2) => news2.id - news1.id);
  return new Promise(resolve => setTimeout(resolve, 1200, fetchedNews))
    .then(news => {
      for (let n of news) {
        n.expanded = false;
      }
      dispatch(receiveNews(news));
    },
    error => {
      dispatch(failureNews());
    });
}

export const fetchNewsDetails = (newsId) => (dispatch, getState) => {
  dispatch(requestNewsDetails());
  let detailsIndex = getState().news.news.findIndex(news => news.id == newsId);
  let details = getState().news.news[detailsIndex];

  return new Promise(resolve => setTimeout(resolve, 1200, details))
    .then(newsDetails => {
      dispatch(receiveNewsDetails(newsDetails));
    },
    error => {
      dispatch(failureNewsDetails());
    });
}

export const fetchCreateNews = news => (dispatch, getState) => {
  dispatch(requestCreateNews());
  return new Promise(resolve => setTimeout(resolve, 1200, news))
    .then(news => {
      let nextId = __findNextId(getState().news.news);
      news.id = nextId;
      let updatedNews = getState().news.news.concat(news);
      dispatch(receiveNews(updatedNews));
      dispatch(fetchNews());
      dispatch(receiveCreateNews());
    },
    error => {
      dispatch(failureCreateNews());
    })
}

export const fetchRemoveNews = newsId => (dispatch, getState) => {
  dispatch(requestRemoveNews());
  return new Promise(resolve => setTimeout(resolve, 1200, newsId))
    .then(newsId => {
      let updatedNews = getState().news.news.filter(news => news.id !== newsId);
      dispatch(receiveNews(updatedNews));
      dispatch(receiveRemoveNews());
    },
    error => {
      dispatch(failureRemoveNews());
    })
}

const defaultState = {
  news: defaultNewsData,
  isNewsFetching: false,
  isDetailsFetching: false,
  newsDetails: null,
  isFetchingCreatingNews: false,
  isFetchingRemoveNews: false,
}

export const {
  requestNews,
  receiveNews,
  failureNews,
  requestNewsDetails,
  receiveNewsDetails,
  failureNewsDetails,
  requestCreateNews,
  receiveCreateNews,
  failureCreateNews,
  requestRemoveNews,
  receiveRemoveNews,
  failureRemoveNews,
  toggleExpandedNews
} = createActions({
  REQUEST_NEWS: null,
  RECEIVE_NEWS: news => news,
  FAILURE_NEWS: null,
  REQUEST_NEWS_DETAILS: null,
  RECEIVE_NEWS_DETAILS: newsDetails => newsDetails,
  FAILURE_NEWS_DETAILS: null,
  REQUEST_CREATE_NEWS: null,
  RECEIVE_CREATE_NEWS: null,
  FAILURE_CREATE_NEWS: null,
  REQUEST_REMOVE_NEWS: null,
  RECEIVE_REMOVE_NEWS: null,
  FAILURE_REMOVE_NEWS: null,
  TOGGLE_EXPANDED_NEWS: (id, isExpanded) => ({id, isExpanded})
});

const newsReducer = handleActions({
  [requestNews]: state => ({ ...state, isNewsFetching: true }),
  [receiveNews]: (state, { payload: news }) => ({ ...state, news, isNewsFetching: false }),
  [failureNews]: state => ({ ...state, isNewsFetching: false }),
  [requestNewsDetails]: state => ({ ...state, isDetailsFetching: true }),
  [receiveNewsDetails]: (state, { payload: newsDetails }) => ({ ...state, newsDetails, isDetailsFetching: false }),
  [failureNewsDetails]: state => ({ ...state, isDetailsFetching: false }),
  [requestCreateNews]: state => ({ ...state, isFetchingCreatingNews: true }),
  [receiveCreateNews]: state => ({ ...state, isFetchingCreatingNews: false }),
  [failureCreateNews]: state => ({ ...state, isFetchingCreatingNews: false }),
  [requestRemoveNews]: state => ({ ...state, isFetchingRemoveNews: true }),
  [receiveRemoveNews]: state => ({ ...state, isFetchingRemoveNews: false }),
  [failureRemoveNews]: state => ({ ...state, isFetchingRemoveNews: false }),
  [toggleExpandedNews]: (state, { payload: { id, isExpanded }}) => {
    let updatedNews = state.news.map(n => {
      return n.id == id ? { ...n, expanded: isExpanded } : n;
    })
    return ({ ...state, news: updatedNews });
  }
},
  defaultState
)

export default newsReducer;

const __findNextId = (news) => {
  let maxId;
  if (news.length === 0) {
    return -1;
  }
  else {
    maxId = news[0].id;
  }
  
  news.forEach(news => {
    if (news.id > maxId) {
      maxId = news.id;
    }
  });

  return maxId + 1;
}

