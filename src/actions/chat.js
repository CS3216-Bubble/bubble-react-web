import { ADD_INCOMING_MESSAGE, POST_MESSAGE, SHOW_OTHERS_TYPING, SHOW_OTHERS_TYPING_STOPPED, LEAVE_CHAT } from '../constants/actionTypes';

export function addIncomingMessage(msg) {
  return {
    type: ADD_INCOMING_MESSAGE,
    msg,
  }
}

export function postMessage(msg) {
  return {
    type: POST_MESSAGE,
    msg,
  }
}

export function showOthersTyping(msg) {
  return {
    type: SHOW_OTHERS_TYPING,
    msg,
  }
}

export function showOthersTypingStopped() {
  return {
    type: SHOW_OTHERS_TYPING_STOPPED,
  }
}

export function leaveChat() {
  return {
    type: LEAVE_CHAT,
  }
}