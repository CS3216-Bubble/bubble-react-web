import * as types from '../constants/actionTypes'
import io from 'socket.io-client'
import { browserHistory, Router } from 'react-router'

let BUBBLE_STATE = 'bubbleId';
let host = 'https://getbubblechat.com/?bubble=';
var uuid = require('uuid4');
if (!window.localStorage[BUBBLE_STATE]) {
  // no bubble id stored, generate a new one
  let bubbleState = uuid();
  window.localStorage[BUBBLE_STATE] = bubbleState;
}
export const bubbleState = window.localStorage[BUBBLE_STATE];
export const socket = io(host + bubbleState);



let chat = require('./chat');


// if (__DEV__) {
//   host = window.location.protocol + '//' + window.location.hostname + ':3000';
// } else {
//   host = window.location.protocol + '//' + window.location.hostname;
// }
const initialState = {
  loaded: false,
  socket: socket,
  bubbleId: '',
  activeChannel: {},
  viewChat: {},
  data: [],
  joinedRooms: [],
  otherRooms: [],
  hiddenUsers: {},
  categoryFilter: {
      'Rant': true,
      'Funny': true,
      'Nostalgia': true,
      'Relationship': true,
      'Advice': true,
      'School': true
  }
}

export default function chats (state = initialState, action) {
  switch (action.type) {
    case types.GET_BUBBLE_ID:
      return {
        ...state,
        bubbleId: action.bubbleId,
      }
    case types.ADD_CHAT:
      const allRooms = _.concat(state.joinedRooms, state.otherRooms)
      if (allRooms.filter(chat => chat.roomName === action.chat.roomName).length !== 0) {
        return state
      }
      return { ...state,
        joinedRooms: [...state.joinedRooms, action.chat],
        activeChannel: action.chat
      }
    case types.ADD_CHAT_ROOMID:
      const tempAddChannel = state.activeChannel
      tempAddChannel.roomId = action.roomId
      return { ...state,
        activeChannel: tempAddChannel
      }
    case types.LOAD_CHATS:
      let otherRooms = action.chats.filter( (chat) => {
        if (!chat) return false;

        var pass = true;
        state.joinedRooms.forEach((joined) => {
          if (!joined) return false;
          if (joined.roomId === chat.roomId) {
            pass = false;
          }
        })
        return pass;
      })

      return { ...state,
        otherRooms: otherRooms,
        data: action.chats
      }
    case types.JOIN_CHAT:
      // cant use lodash difference to remove other rooms because obj is different
      return { ...state,
        activeChannel: action.chat,
        joinedRooms: _.concat(state.joinedRooms, action.chat),
        otherRooms: state.otherRooms.filter(room => room.roomId != action.chat.roomId)
      }
    case types.LEAVE_CHAT:
      // TODO: support changes in userId
      if (state.activeChannel.roomId) {
        state.socket.emit('exit_room', {
          roomId: state.activeChannel.roomId,
          userId: state.socket.id,
          bubbleId: chats.bubbleId,
        })

        const oldChat = state.activeChannel
        return { ...state,
          activeChannel: {},
          joinedRooms: state.joinedRooms.filter(room => room ? (room.roomId != oldChat.roomId) : false),
          otherRooms: _.concat(state.otherRooms, oldChat)
        }
      }
      return state
    case types.VIEW_CHAT:
      action.chat.createdByBubbleUsername = action.chat.createdByBubbleId ? chat.generateName(action.chat.createdByBubbleId) : undefined;
      action.chat.createdByUsername = action.chat.createdBy ? chat.generateName(action.chat.createdBy) : undefined;

      return { ...state,
        viewChat: action.chat
      }
    case types.NEW_USER_JOINED:
      // user is added to rooms previously present (havent exit)
      if (action.data.messages) {
        return { ...state,
          joinedRooms: [...state.joinedRooms, action.chat]
        }
      }
      const join_msg = _.assign(action, { messageType: 'user-joined' })
      return { ...state,
        messages: _.concat(state.messages, join_msg)
      }
    case types.TOGGLE_CATEGORY:
      const tempFilter = _.cloneDeep(state.categoryFilter)
      tempFilter[action.category] = !tempFilter[action.category]
      return { ...state,
        categoryFilter: tempFilter
      }
    case types.HIDE_USER:
      const hiddenDict = state.hiddenUsers;
      if (!hiddenDict[action.roomId]) {
        hiddenDict[action.roomId] = [];
      }
      hiddenDict[action.roomId] = _.concat(hiddenDict[action.roomId], action.userId);
      return { ...state,
        hiddenUsers: hiddenDict,
      }
    case types.UNHIDE_USER:
      const removeHiddenUser = _.findIndex(state.hiddenUsers[action.roomId], function (u) {
        return u === action.userId;
      })
      const newHiddenUsers = state.hiddenUsers[action.roomId].filter( userId => {
        return userId !== action.userId;
      })
      state.hiddenUsers[action.roomId] = newHiddenUsers;
      return { ...state,
        hiddenUsers: state.hiddenUsers
      }
    default:
      return state
  }
}
