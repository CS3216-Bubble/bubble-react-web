import * as types from '../constants/actionTypes'
import { browserHistory } from 'react-router'
import fetch from 'isomorphic-fetch'

export function getBubbleId (bubbleId) {
  return {
    type: types.GET_BUBBLE_ID,
    bubbleId
  }
}

export function addChat (chat) {
  return {
    type: types.ADD_CHAT,
    chat
  }
}

export function loadChats (chats) {
  return {
    type: types.LOAD_CHATS,
    chats
  }
}

export function joinChat (chat) {
  return {
    type: types.JOIN_CHAT,
    chat
  }
}

export function addChatRoomId (roomId) {
  return {
    type: types.ADD_CHAT_ROOMID,
    roomId
  }
}

export function viewChat (chat) {
  return {
    type: types.VIEW_CHAT,
    chat
  }
}

export function toggleCategory (category) {
  return {
    type: types.TOGGLE_CATEGORY,
    category
  }
}

export function hideUser(userId, roomId) {
  return {
    type: types.HIDE_USER,
    userId,
    roomId
  }
}

export function unhideUser(userId, roomId) {
  return {
    type: types.UNHIDE_USER,
    userId,
    roomId,
  }
}
