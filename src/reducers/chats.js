import { ADD_CHAT, LOAD_CHATS, JOIN_CHAT, LEAVE_CHAT } from '../constants/actionTypes';
import io from 'socket.io-client';

const host = window.location.protocol + '//' + window.location.hostname + ':3000';
const initialState = {
  loaded: false,
  data: [],
  socket: io(host),
  activeChannel: {}
};

export default function chats(state = initialState, action) {
  console.log('enter chats');
  switch (action.type) {
    case ADD_CHAT:
      console.log('add chat');
      if (state.data.filter(chat => chat.roomName === action.chat.roomName).length !== 0) {
        return state;
      }
      return {...state,
        data: [...state.data, action.chat]
      };
    case LOAD_CHATS:
      console.log('action chats', action.chats);
      return {...state,
        data: action.chats,
      };
    case JOIN_CHAT: 
      console.log('join chat');

      // leave any chat before joining
      // TODO: support changes in userId
      if (state.activeChannel.roomId) {
        state.socket.emit('exit_room', {
          roomId: activeChannel.roomId,
          userId: socket.id,
        });
      }

      return {...state,
        activeChannel: action.chat,
      };
    case LEAVE_CHAT:

      // TODO: support changes in userId
      if (state.activeChannel.roomId) {
        state.socket.emit('exit_room', {
          roomId: activeChannel.roomId,
          userId: socket.id,
        });
      }

      return {...state,
        activeChannel: {},
      };
    default:
      console.log('default');
      return state;
  }
}


