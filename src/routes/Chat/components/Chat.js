import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import TypingListItem from './TypingListItem';
import Divider from 'material-ui/Divider';
import { addIncomingMessage, postMessage, showOthersTyping, showOthersTypingStopped } from '../../../actions/chat'
import { Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';


class Chat extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      // targetedUser: ''
      messages: [],
      typer: ''
    }
  }
  componentDidMount() {
    const { socket } = this.props;
    // TODO: LOAD MESSAGES socket.on(load_messages), socket.emit(load_messages)
    socket.on('add_message', (msg) => {
      // this.setState( {messages: _.concat(this.state.messages, msg)} );
      this.props.addIncomingMessage(msg);
      console.log('someone typedd ', msg);
      console.log('messages', this.props.chat.messages);
    });
    socket.on('typing', (msg) => {
      console.log(msg.userId,' someone is typing');
      this.props.showOthersTyping(msg);
      // this.setState( {typer: msg.userId} );
    });
    socket.on('stop_typing', user =>
      // this.setState( {typer: ''} );
      this.props.showOthersTypingStopped()
    );
  }

  handleClickOnUser(user) {

  }


  render() {
    const { socket, activeChannel, postMessage } = this.props; 

    const generateMessages = () => {
      const messageCells = [];
      console.log('generating changes');
      this.props.chat.messages.map( (message, i) =>
        messageCells.push(<MessageListItem key={i} handleClickOnUser={::this.handleClickOnUser} message={message}/>)
      )
      return messageCells;
    };

    return (
      <div style={{padding: '0', height: '100%', width: '100%', display: '-webkit-box'}}>
        <div className="chat-main">
          <header className="chat-title">
            <div>
            {activeChannel.roomName}
            </div>
          </header>
          <Divider />

          <ul className="chat-body">
            { generateMessages() }
          </ul>
          
          <div className="chat-footer">
            <MessageComposer socket={socket} activeChannel={activeChannel} postMessage={postMessage}/>
            <footer style={{flexShrink:'0', fontSize: '1em', width: '100%', opacity: '0.5'}}>
            {this.props.chat.typer !== '' &&
              <div>
                <span>
                  <TypingListItem username={this.props.chat.typer}/>
                  <span> is typing</span>
                </span>
              </div>}
          </footer>
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
};

export default connect(mapStateToProps, mapDispatch)(Chat)

