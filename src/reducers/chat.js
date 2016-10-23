import { ADD_CHAT, JOIN_CHAT, LEAVE_CHAT, ADD_INCOMING_MESSAGE, POST_MESSAGE, SHOW_OTHERS_TYPING, SHOW_OTHERS_TYPING_STOPPED, NEW_USER_JOINED } from '../constants/actionTypes';
import _ from 'lodash';

const initialState = {
  loaded: false,
  messages: [],
  typer: '',
};

export default function chat(state = initialState, action) {
  switch (action.type) {
    case ADD_CHAT:
    case JOIN_CHAT:
      return {...state,
        messages: [],
      }
    case LEAVE_CHAT:
      return {...state,
        messages: [],
      }
    case ADD_INCOMING_MESSAGE:
      return {...state,
        messages: _.concat(state.messages, action.msg)
      };
    case POST_MESSAGE:
      return {...state,
        messages: _.concat(state.messages, action.msg)
      };
    case SHOW_OTHERS_TYPING: 
      return {...state,
        typer: action.msg.userId
      }
    case SHOW_OTHERS_TYPING_STOPPED:
      return {...state,
        typer: '',
      }
    case NEW_USER_JOINED:
      return {...state,
        messages: _.concat(state.messages, action)
      };
    default:
      console.log('default');
      return state;
  }
}


