import { ADD_CHAT, LOAD_CHATS, JOIN_CHAT, ADD_CHAT_ROOMID, VIEW_CHAT, TOGGLE_CATEGORY } from '../constants/actionTypes';
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

export function addChatRoomId(roomId) {
  return {
    type: ADD_CHAT_ROOMID,
    roomId,
  }
}

export function viewChat(chat) {
  return {
    type: VIEW_CHAT,
    chat,
  }
}

export function toggleCategory(category) {
  return {
    type: TOGGLE_CATEGORY,
    category,
  }
}