import * as types from '../constants/actionTypes'
import _ from 'lodash'
import Moment from 'moment'

let socket = require('./chats')
let adjectives = require('../utils/adjectives')
let animals = require('../utils/animals')
let numAvatars = 160;

const initialState = {
  loaded: false,
  pendingMessages: [],
  messages: [],
  typer: ''
}

// Utility function for hashing
function hashID(userId) {
    var hash = 0;
    if (userId && userId.length != 0) {
        for (var i = 0; i < userId.length; i++) {
            let char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
    }
    return hash;
}

// Name generator
function generateName(userId) {
    var hashCode = hashID(userId);
    var adj = adjectives.adjectives;
    var ani = animals.animals;
    // Get adjective
    var adjective = adj[((hashCode % adj.length) + adj.length) % adj.length];
    // Get animal
    var animal = ani[((hashCode % ani.length) + ani.length) % ani.length];
    // Return result
    return adjective + " " + animal;
}

export default function chat (state = initialState, action) {
  switch (action.type) {
    case types.ADD_CHAT:
      return { ...state,
        messages: []
      }
    case types.JOIN_CHAT:
      action.chat.messages.sort(function (a, b) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      action.chat.messages.forEach(m => m.username = generateName(m.userId));
      console.log(action.chat.messages);
      return { ...state,
        messages: action.chat.messages
      }
    case types.LEAVE_CHAT:
      return { ...state,
        messages: []
      }
    case types.ADD_INCOMING_MESSAGE:
      const removePendingIndex = _.findIndex(state.pendingMessages, function (m) {
        return m.message === action.msg.content
      })
      state.pendingMessages.splice(removePendingIndex, 1)
      action.msg.username = generateName(action.msg.userId)
      return { ...state,
        messages: _.concat(state.messages, action.msg),
        pendingMessages: state.pendingMessages
      }
    case types.POST_MESSAGE:
      action.msg.username = generateName(socket.id);
      return { ...state,
        pendingMessages: _.concat(state.pendingMessages, action.msg)
      }
    case types.SHOW_OTHERS_TYPING:
      return { ...state,
        typer: action.msg.userId
      }
    case types.SHOW_OTHERS_TYPING_STOPPED:
      return { ...state,
        typer: ''
      }
    case types.NEW_USER_JOINED:
      const join_msg = _.assign(action, { messageType: 'user-joined' })
      join_msg.data.username = generateName(action.data.userId);
      return { ...state,
        messages: _.concat(state.messages, join_msg)
      }
    case types.USER_EXIT:
      const exit_msg = _.assign(action, { messageType: 'user-exited' })
      exit_msg.data.username = generateName(action.data.userId);
      return { ...state,
        messages: _.concat(state.messages, exit_msg)
      }
    default:
      return state
  }
}

