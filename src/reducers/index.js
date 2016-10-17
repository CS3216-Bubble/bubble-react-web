import { combineReducers } from 'redux';
import runtime from './runtime';
import user from './chats';

export default combineReducers({
  chats,
});
