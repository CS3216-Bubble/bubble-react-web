import { ADD_INCOMING_MESSAGE, POST_MESSAGE, SHOW_OTHERS_TYPING, SHOW_OTHERS_TYPING_STOPPED } from '../constants/actionTypes';
import _ from 'lodash';

const initialState = {
  loaded: false,
  messages: [],
  typer: '',
};

export default function chat(state = initialState, action) {
  switch (action.type) {
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
    default:
      console.log('default');
      return state;
  }
}


