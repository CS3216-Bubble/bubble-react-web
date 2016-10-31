import * as types from '../constants/actionTypes'
import io from 'socket.io-client'
import { browserHistory, Router } from 'react-router'

let host;
if (__DEV__) {
  host = window.location.protocol + '//' + window.location.hostname + ':3000';
} else {
  host = window.location.protocol + '//' + window.location.hostname;
}
const initialState = {
  loaded: false,
  socket: io(host),
  activeChannel: {},
  viewChat: {},
  joinedRooms: [],
  otherRooms: [],
  categoryFilter: {
    'Rant': false,
    'Funny': false,
    'Nolstagia': false,
    'Relationship': false,
    'Advice': false,
    'School': false,
    'Chit-chat': false
  }
}

export default function chats (state = initialState, action) {
  switch (action.type) {
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
      return { ...state,
        otherRooms: _.difference(action.chats, state.joinedRooms)
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
          userId: state.socket.id
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
    default:
      return state
  }
}
