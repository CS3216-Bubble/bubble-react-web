import { ADD_CHAT, ADD_CHAT_ROOMID, LOAD_CHATS, JOIN_CHAT, LEAVE_CHAT, NEW_CHAT, NEW_USER_JOINED, VIEW_CHAT } from '../constants/actionTypes';
import io from 'socket.io-client';
import { browserHistory, Router } from 'react-router'

const host = window.location.protocol + '//' + window.location.hostname + ':3000';
const initialState = {
  loaded: false,
  data: [],
  socket: io(host),
  activeChannel: {},
  viewChat: {},
};

export default function chats(state = initialState, action) {

  switch (action.type) {
    case ADD_CHAT:
      console.log('add chat');
      if (state.data.filter(chat => chat.roomName === action.chat.roomName).length !== 0) {
        return state;
      }
      return {...state,
        data: [...state.data, action.chat],
        activeChannel: action.chat,
      };
    case ADD_CHAT_ROOMID:
      const tempAddChannel = state.activeChannel;
      tempAddChannel.roomId = action.roomId;
      console.log('temp', tempAddChannel);
      return {...state,
        activeChannel: tempAddChannel,
      }
    case LOAD_CHATS:
      console.log('action chats', action.chats);
      return {...state,
        data: action.chats,
      };
    case JOIN_CHAT: 
      return {...state,
        activeChannel: action.chat,
      };
    case LEAVE_CHAT:
      // TODO: support changes in userId
      if (state.activeChannel.roomId) {
        state.socket.emit('exit_room', {
          roomId: state.activeChannel.roomId,
          userId: state.socket.id,
        });
      }
      return {...state,
        activeChannel: {},
      };
    case VIEW_CHAT:
      return {...state,
        viewChat: action.chat,
      }
    default:
      console.log('default');
      return state;
  }
}


