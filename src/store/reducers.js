import { combineReducers } from 'redux'
import locationReducer from './location'
import chats from '../reducers/chats'
import chat from '../reducers/chat'
import environment from '../reducers/environment'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    chats,
    chat,
    environment,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
