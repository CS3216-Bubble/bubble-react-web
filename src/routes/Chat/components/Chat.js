import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import MessageComposer from './MessageComposer'
import MessageListItem from './MessageListItem'
import TypingListItem from './TypingListItem'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import { addIncomingMessage, addIncomingReaction, postMessage, showOthersTyping, showOthersTypingStopped, newUserJoined, userExit, leaveChat } from '../../../actions/chat'
import { hideUser, unhideUser } from '../../../actions/chats'

let adjectives = require('../../../utils/adjectives')
let animals = require('../../../utils/animals')
let numAvatars = 160;

class Chat extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor (props, context) {
    super(props, context)
    this.state = {
      messages: [],
      typer: '',
      openUserModal: false,
      openHideUsersModal: false,
      selectedUser: {},
    }
  }
  componentDidMount () {
    const { socket } = this.props
    // TODO: LOAD MESSAGES socket.on(load_messages), socket.emit(load_messages)
    socket.on('add_message', (msg) => {
      this.props.addIncomingMessage(msg)
    })
    socket.on('add_reaction', (msg) => {
      this.props.addIncomingReaction(msg)
    })
    socket.on('typing', (msg) => {
      this.props.showOthersTyping(msg)
    })
    socket.on('stop_typing', user =>
      this.props.showOthersTypingStopped()
    )
    socket.on('join_room', (msg) =>
      this.props.newUserJoined(msg)
    )
    socket.on('exit_room', (msg) => {
      if (msg) {
        this.props.userExit(msg)
      }
    })
    socket.on('i_exit', () => {
      this.props.leaveChat()
      browserHistory.push('/')
    })
    const messageList = this.refs.messageList
    messageList.scrollTop = messageList.scrollHeight
  }
  componentDidUpdate () {
    const messageList = this.refs.messageList
    messageList.scrollTop = messageList.scrollHeight
  }
  componentWillUnmount () {
      // Remove all listeners that depends on the mount state of the component
    this.props.socket.off('add_message')
    this.props.socket.off('add_reaction')
    this.props.socket.off('typing')
    this.props.socket.off('stop_typing')
    this.props.socket.off('join_room')
    this.props.socket.off('exit_room')
  }

  handleOpenHideUsers = () => {
    this.setState({openHideUsersModal: true});
  }

  handleCloseHideUsers = () => {
    this.setState({openHideUsersModal: false});
  }

  handleClickOnUser = (user) => {
    this.setState({
      openUserModal: true,
      selectedUser: user,
    })
  }

  handleCloseUserModal = () => {
    this.setState({
      openUserModal: false,
      selectedUser: {},
    })
  }

  handleThankReaction = () => {
    const {socket, activeChannel, chats} = this.props;
    // NOTE BubbleId
    var request = {
      user: chats.bubbleId,
      roomId: activeChannel.roomId,
      reaction: 'THANK',
      targetUser: this.state.selectedUser.bubbleId || this.state.selectedUser.userId
    };
    this.props.socket.emit('add_reaction', request);
    this.setState({
      openUserModal: false,
      selectedUser: {},
    })
  }

  handleCheerReaction = () => {
    const {socket, activeChannel, chats} = this.props;
    // NOTE BubbleId
    var request = {
      user: chats.bubbleId,
      roomId: activeChannel.roomId,
      reaction: 'CHEER',
      targetUser:  this.state.selectedUser.bubbleId || this.state.selectedUser.userId
    };
    this.props.socket.emit('add_reaction', request);
    this.setState({
      openUserModal: false,
      selectedUser: {},
    })
  }

  handleHideUser = () => {
    this.props.hideUser(this.state.selectedUser.bubbleId || this.state.selectedUser.userId, this.props.activeChannel.roomId);
    this.setState({
      openUserModal: false,
      selectedUser: {},
    });
  }

  // Utility function for hashing
  hashID(userId) {
      var hash = 0;
      if (userId && userId.length != 0) {
          for (var i = 0; i < userId.length; i++) {
              let char = userId.charCodeAt(i);
              hash = ((hash << 5) - hash) + char;
              hash = hash & hash;
          }
      }
      return hash;
  }

  // Name generator
  generateName(userId) {
      var hashCode = this.hashID(userId);
      var adj = adjectives.adjectives;
      var ani = animals.animals;
      // Get adjective
      var adjective = adj[((hashCode % adj.length) + adj.length) % adj.length];
      adjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
      // Get animal
      var animal = ani[((hashCode % ani.length) + ani.length) % ani.length];
      animal = animal.charAt(0).toUpperCase() + animal.slice(1);
      // Return result
      return adjective + " " + animal;
  }

  leaveChat () {
    this.props.socket.emit('exit_room', {roomId: this.props.activeChannel.roomId})
  }

  render () {
    const { socket, activeChannel, postMessage } = this.props

    const bodyStyle = {
      height: `${0.9 * (window.innerHeight - 72 - 64 - 10)}px`
    }
    const footerStyle = {
      height: `${0.1 * (window.innerHeight - 72 - 64 - 10)}px`
    }
    const generateMessages = () => {
      const hideIds = this.props.chats.hiddenUsers[this.props.activeChannel.roomId];
      const messages = this.props.chat.messages.filter((message) => {
        var pass = true;
        if (hideIds) {
          hideIds.forEach(id => {
            if (id === message.bubbleId || id === message.userId || (message.data && message.data.userId === id)) {
              pass = false;
            }
          })
        }
        return pass;
      });

      return messages.map((message, i) => {
        if (message.sentByMe || message.bubbleId === this.props.chats.bubbleId || message.userId === socket.id) {
          return <MessageListItem key={i} messageType='my-message' handleClickOnUser={::this.handleClickOnUser} message={message} />
        } else if (message.messageType === 'user-joined' || message.messageType === 'user-exited') {
            // Not a message- user joined
          if (!(message.messageType === 'user-exited' && message.data.userId === socket.id)) {
            return <MessageListItem key={i} messageType={message.messageType} handleClickOnUser={::this.handleClickOnUser} message={message} />
          }
        } else {
          return <MessageListItem key={i} messageType='others-message' handleClickOnUser={::this.handleClickOnUser} message={message} />
        }
      })
    }

    const generatePendingMessages = () =>
      this.props.chat.pendingMessages.map((message, i) =>
        <MessageListItem key={i} messageType='pending' handleClickOnUser={::this.handleClickOnUser} message={message} />
      )

    const selectedUserActions = [
      <RaisedButton
        label="Thank"
        primary={true}
        onTouchTap={this.handleThankReaction}
      />,
      <RaisedButton
        label="Cheer"
        secondary={true}
        onTouchTap={this.handleCheerReaction}
      />,
      <RaisedButton
        label="Hide"
        onTouchTap={this.handleHideUser}
      />,
    ];

    const imageStyle = {
      width: '150px',
      height: '150px',
      marginLeft: '50px',
      marginBottom: '20px',
    }

    const buttonStyle = {
      minWidth: '25px',
      marginRight: '5px',
    }

    const userModal = (
      <div>
        <Dialog
          modal={false}
          open={this.state.openUserModal}
          contentStyle={{width: '290px'}}
          onRequestClose={this.handleCloseUserModal}
        >
        <h3 style={{textAlign: 'center'}}>{this.state.selectedUser.username}</h3>
        <Divider />
        <img style={imageStyle} src= {'https://flathash.com/' + (this.state.selectedUser.bubbleId ? this.state.selectedUser.bubbleId : this.state.selectedUser.userId || '1') } alt="" />
        <div>
          <RaisedButton
            style={buttonStyle}
            label="Thank"
            primary={true}
            onTouchTap={this.handleThankReaction}
          />
          <RaisedButton
            style={buttonStyle}
            label="Cheer"
            secondary={true}
            onTouchTap={this.handleCheerReaction}
          />
          <RaisedButton
            style={buttonStyle}
            label="Hide"
            onTouchTap={this.handleHideUser}
          />
        </div>
        </Dialog>
      </div>
    )

    const hideUserModal = (
      <Dialog
          modal={false}
          title="Hidden Users"
          open={this.state.openHideUsersModal}
          contentStyle={{width: '390px'}}
          onRequestClose={this.handleCloseHideUsers}
        >
        <List>
          { this.props.chats.hiddenUsers[this.props.activeChannel.roomId] && this.props.chats.hiddenUsers[this.props.activeChannel.roomId].map((userId, i) =>
            <ListItem
              primaryText={this.generateName(userId)}
              key={i}
              leftAvatar={<Avatar src={'https://flathash.com/' + userId } />}
              rightIconButton={<RaisedButton style={buttonStyle} label="Unhide" secondary={true} onTouchTap={() => {this.props.unhideUser(userId, this.props.activeChannel.roomId); this.handleCloseHideUsers();}}/>}
            />
          )}

        </List>
      </Dialog>
    )
      
    return (
      <div style={{ padding: '0', height: '100%', width: '100%', display: '-webkit-box' }}>
        <div className='chat-main'>
          <div className='chat-title-div'>
            <div style={{textAlign:'center'}}>
            <span className='chat-title'>
              {activeChannel.roomName}
            </span>
            </div>
            <div className='settings-button'>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Unhide users" onTouchTap={() => this.handleOpenHideUsers()}/>
                <MenuItem primaryText="Leave room" onTouchTap={() => this.leaveChat()}/>
              </IconMenu>
            </div>
          </div>


          <Divider />

          <ul className='chat-body' style={bodyStyle} ref='messageList' >
            { generateMessages() }
            { generatePendingMessages() }
          </ul>

          <div className='chat-footer' style={footerStyle}>
            <MessageComposer socket={socket} activeChannel={activeChannel} postMessage={postMessage} bubbleId={this.props.chats.bubbleId} />
            <div style={{ flexShrink:'0', fontSize: '1em', width: '100%', opacity: '0.5' }}>
              {this.props.chat.typer !== '' &&
                <div className='pull-right'>
                  <span>
                    <TypingListItem username={this.generateName(this.props.chat.typer)} />
                    <span> is typing</span>
                  </span>
                </div>}
            </div>
          </div>
        </div>
        {userModal}
        {hideUserModal}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { chat, chats } = state
  return {
    chat,
    chats
  }
}

const mapDispatch = {
  hideUser,
  unhideUser,
  addIncomingMessage,
  addIncomingReaction,
  postMessage,
  showOthersTyping,
  showOthersTypingStopped,
  newUserJoined,
  userExit,
  leaveChat,
}

export default connect(mapStateToProps, mapDispatch)(Chat)
