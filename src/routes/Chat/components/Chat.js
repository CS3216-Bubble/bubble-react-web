import React, { Component, PropTypes } from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import TypingListItem from './TypingListItem';
import { Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';

export default class Chat extends Component {

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
    socket.on('add_message', msg =>
      this.state.messages.append(msg)
    );
    socket.on('typing', msg =>
      this.state.typer = msg.userId
    );
    socket.on('stop_typing', user =>
      this.state.typer = ''
    );
  }

  handleClickOnUser(user) {

  }

  render() {
    const { socket, activeChannel, messages } = this.props;
    
    return (
      <div style={{margin: '30em', padding: '0', height: '100%', width: '100%', display: '-webkit-box'}}>
        <div className="main">
          <header style={{background: '#FFFFFF', color: 'black', flexGrow: '0', order: '0', fontSize: '2.3em', paddingLeft: '0.2em'}}>
            <div>
            {activeChannel.roomName}
            </div>
          </header>
          <ul style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', padding: '0', paddingBottom: '1em', flexGrow: '1', order: '1'}} ref="messageList">
            {this.state.messages.forEach(message =>
              <MessageListItem handleClickOnUser={::this.handleClickOnUser} message={message}/>
            )}
          </ul>
          <MessageComposer socket={socket} activeChannel={activeChannel} />
        </div>
        <footer style={{fontSize: '1em', position: 'fixed', bottom: '0.2em', left: '21.5rem', color: '#000000', width: '100%', opacity: '0.5'}}>
          {this.state.typer !== '' &&
            <div>
              <span>
                <TypingListItem username={this.state.typer}/>
                <span> is typing</span>
              </span>
            </div>}
        </footer>
      </div>
    );
  }
}
