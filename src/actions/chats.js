import { ADD_CHAT, LOAD_CHATS, JOIN_CHAT } from '../constants/actionTypes';
import { browserHistory } from 'react-router';
import fetch from 'isomorphic-fetch';

export function addChat(chat) {
  return {
    type: ADD_CHAT,
    chat,
  }
}

export function loadChats(chats) {
  return {
    type: LOAD_CHATS,
    chats,
  }
}

export function joinChat(chat) {
  return {
    type: JOIN_CHAT,
    chat,
  }
}