import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import TypingListItem from './TypingListItem';
import Divider from 'material-ui/Divider';
import { addIncomingMessage, postMessage, showOthersTyping, showOthersTypingStopped, newUserJoined, userExit } from '../../../actions/chat';

class Chat extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      messages: [],
      typer: ''
    }
  }
  componentDidMount() {
    const { socket } = this.props;
    // TODO: LOAD MESSAGES socket.on(load_messages), socket.emit(load_messages)
    socket.on('add_message', (msg) => {
      this.props.addIncomingMessage(msg);
    });
    socket.on('typing', (msg) => {
      this.props.showOthersTyping(msg);
    });
    socket.on('stop_typing', user =>
      this.props.showOthersTypingStopped()
    );
    socket.on('join_room', (msg) =>
      this.props.newUserJoined(msg)
    );
    socket.on('exit_room', (msg) => {
      if (msg) {
        this.props.userExit(msg)
      }
    });
  }

  handleClickOnUser(user) {

  }


  render() {
    const { socket, activeChannel, postMessage } = this.props; 

    const bodyStyle ={
      height: `${0.9 * (window.innerHeight - 72 - 64 - 10)}px`
    };
    const footerStyle = {
      height: `${0.1 * (window.innerHeight - 72 - 64 - 10)}px`
    };
    const generateMessages = () => {
      const messageCells = [];
      this.props.chat.messages.map( (message, i) => {
          if (message.userId === socket.id) {
            messageCells.push(<MessageListItem key={i} messageType="my-message" handleClickOnUser={::this.handleClickOnUser} message={message}/>)
          } else if (message.messageType === 'user-joined' || message.messageType==='user-exited') {
            // Not a message- user joined
            messageCells.push(<MessageListItem key={i} messageType={message.messageType} handleClickOnUser={::this.handleClickOnUser} message={message}/>)
          } else { 
            messageCells.push(<MessageListItem key={i} messageType="others-message" handleClickOnUser={::this.handleClickOnUser} message={message}/>)
          }
        }
      )
      return messageCells;
    };

    return (
      <div style={{padding: '0', height: '100%', width: '100%', display: '-webkit-box'}}>
        <div className="chat-main">
          <header className="chat-title-div">
            <span className="chat-title">
            {activeChannel.roomName}
            </span>
          </header>
          <Divider />

          <ul className="chat-body" style={bodyStyle} >
            { generateMessages() }
          </ul>
          
          <div className="chat-footer" style={footerStyle}>
            <MessageComposer socket={socket} activeChannel={activeChannel} postMessage={postMessage}/>
            <div style={{flexShrink:'0', fontSize: '1em', width: '100%', opacity: '0.5'}}>
              {this.props.chat.typer !== '' &&
                <div className="pull-right">
                  <span>
                    <TypingListItem username={this.props.chat.typer}/>
                    <span> is typing</span>
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { chat } = state;
  return {
    chat,
  }
}

const mapDispatch = {
  addIncomingMessage,
  postMessage,
  showOthersTyping,
  showOthersTypingStopped,
  newUserJoined,
  userExit
};

export default connect(mapStateToProps, mapDispatch)(Chat)

