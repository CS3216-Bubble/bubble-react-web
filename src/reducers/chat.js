import * as types from '../constants/actionTypes';
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
    case types.ADD_CHAT:
      return {...state,
        messages: [],
      }
    case types.JOIN_CHAT:
      return {...state,
        messages: action.chat.messages,
      }
    case types.LEAVE_CHAT:
      return {...state,
        messages: [],
      }
    case types.ADD_INCOMING_MESSAGE:
      const removePendingIndex = _.findIndex(state.pendingMessages, function(m) {
        return m.message === action.msg.content;
      });
      state.pendingMessages.splice(removePendingIndex, 1);
      return {...state,
        messages: _.concat(state.messages, action.msg),
        pendingMessages: state.pendingMessages,
      };
    case types.POST_MESSAGE:
      return {...state,
        pendingMessages: _.concat(state.pendingMessages, action.msg)
      };
    case types.SHOW_OTHERS_TYPING: 
      return {...state,
        typer: action.msg.userId
      }
    case types.SHOW_OTHERS_TYPING_STOPPED:
      return {...state,
        typer: '',
      }
    case types.NEW_USER_JOINED:
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
    case types.USER_EXIT:
      const exit_msg = _.assign(action, {messageType: 'user-exited'} );
      return {...state,
        messages: _.concat(state.messages, exit_msg)
      };
    default:
      return state;
  }
}


