import * as types from '../constants/actionTypes'

export function addIncomingMessage (msg) {
  return {
    type: types.ADD_INCOMING_MESSAGE,
    msg
  }
}

export function postMessage (msg) {
  return {
    type: types.POST_MESSAGE,
    msg
  }
}

export function showOthersTyping (msg) {
  return {
    type: types.SHOW_OTHERS_TYPING,
    msg
  }
}

export function showOthersTypingStopped () {
  return {
    type: types.SHOW_OTHERS_TYPING_STOPPED
  }
}

export function leaveChat () {
  return {
    type: types.LEAVE_CHAT
  }
}

export function newUserJoined (data) {
  return {
    type: types.NEW_USER_JOINED,
    data
  }
}

export function userExit (data) {
  return {
    type: types.USER_EXIT,
    data
  }
}
