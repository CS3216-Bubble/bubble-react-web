import { combineReducers } from 'redux'
import locationReducer from './location'
import chats from '../reducers/chats'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    chats,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
