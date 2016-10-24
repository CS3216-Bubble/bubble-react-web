import { ADD_CHAT, JOIN_CHAT, LEAVE_CHAT, ADD_INCOMING_MESSAGE, POST_MESSAGE, SHOW_OTHERS_TYPING, SHOW_OTHERS_TYPING_STOPPED, NEW_USER_JOINED, USER_EXIT } from '../constants/actionTypes';
import _ from 'lodash';
import Moment from 'moment';

const initialState = {
  loaded: false,
  pendingMessages: [],
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
      const removePendingIndex = _.findIndex(state.pendingMessages, function(m) {
        console.log('content', action.msg.content);
        return m.message === action.msg.content;
      });
      console.log('pre pending', state.pendingMessages);
      state.pendingMessages.splice(removePendingIndex, 1);
      console.log('post pending', state.pendingMessages);
      return {...state,
        messages: _.concat(state.messages, action.msg),
        pendingMessages: state.pendingMessages,
      };
    case POST_MESSAGE:
      return {...state,
        pendingMessages: _.concat(state.pendingMessages, action.msg)
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
      const join_msg = _.assign(action, {messageType: 'user-joined'} );
      // Load existing messages to user just joined
      if (action.data.messages) {
        // sort the messages according to time
        action.data.messages.sort(function (left, right) {
            return Moment.utc(left.createdAt).diff(Moment.utc(right.createdAt))
        });
        return {...state,
          messages: _.concat(action.data.messages, join_msg)
        };
      }
      return {...state,
        messages: _.concat(state.messages, join_msg)
      };
    case USER_EXIT:
      const exit_msg = _.assign(action, {messageType: 'user-exited'} );
      return {...state,
        messages: _.concat(state.messages, exit_msg)
      };
    default:
      console.log('default');
      return state;
  }
}


