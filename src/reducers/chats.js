import { ADD_CHAT, ADD_CHAT_ROOMID, LOAD_CHATS, JOIN_CHAT, LEAVE_CHAT, NEW_CHAT, NEW_USER_JOINED, VIEW_CHAT} from '../constants/actionTypes';
import io from 'socket.io-client';
import { browserHistory, Router } from 'react-router'

const host = window.location.protocol + '//' + window.location.hostname + ':3000';
const initialState = {
  loaded: false,
  socket: io(host),
  activeChannel: {},
  viewChat: {},
  joinedRooms: [],
  otherRooms: [],
};

export default function chats(state = initialState, action) {

  switch (action.type) {
    case ADD_CHAT:
      console.log('add chat');
      const allRooms = _.concat(state.joinedRooms, state.otherRooms);
      if (allRooms.filter(chat => chat.roomName === action.chat.roomName).length !== 0) {
        return state;
      }
      return {...state,
        joinedRooms: [...state.joinedRooms, action.chat],
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
        otherRooms: _.difference(action.chats, state.joinedRooms),
      };
    case JOIN_CHAT: 
      // cant use lodash difference to remove other rooms because obj is different
      return {...state,
        activeChannel: action.chat,
        joinedRooms: _.concat(state.joinedRooms, action.chat),
        otherRooms: state.otherRooms.filter(room => room.roomId != action.chat.roomId),
      };
    case LEAVE_CHAT:
      // TODO: support changes in userId
      if (state.activeChannel.roomId) {
        state.socket.emit('exit_room', {
          roomId: state.activeChannel.roomId,
          userId: state.socket.id,
        });
      }
      const tempRoom = _.difference(state.joinedRooms, activeChannel);
      return {...state,
        activeChannel: {},
        joinedRooms: tempRoom,
      };
    case VIEW_CHAT:
      return {...state,
        viewChat: action.chat,
      }
    case NEW_USER_JOINED:
      // user is added to rooms previously present (havent exit)
     if (action.data.messages) {
        return {...state,
          joinedRooms: [...state.joinedRooms, action.chat],
        };
      }
      return {...state,
        messages: _.concat(state.messages, join_msg)
      };
    default:
      console.log('default');
      return state;
  }
}


