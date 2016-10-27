import { combineReducers } from 'redux'
import runtime from './runtime'
import chats from './chats'
import chat from './chat'

export default combineReducers({
  chats,
  chat
})
