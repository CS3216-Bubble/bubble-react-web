import { ADD_CHAT, LOAD_CHATS } from '../constants/actionTypes';

const initialState = {
  loaded: false,
  data: []
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
    default:
      console.log('default');
      return state;
  }
}


