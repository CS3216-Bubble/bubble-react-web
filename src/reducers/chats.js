import { ADD_CHAT } from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  data: []
};

export default function chats(state = initialState, action) {
  switch (action.type) {
  case ADD_CHAT:
    if (state.data.filter(chat => chat.name === action.chat.name).length !== 0) {
      return state;
    }
    return {...state,
      data: [...state.data, action.chat]
    };
    default:
    return state;
  }
}


