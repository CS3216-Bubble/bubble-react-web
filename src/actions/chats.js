import { ADD_CHAT } from '../constants/ActionTypes';
import { browserHistory } from 'react-router';
import fetch from 'isomorphic-fetch';

export function addChat(chat) {
  return {
    type: ADD_CHAT,
    chat,
  }
}