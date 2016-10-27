import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import MessageComposer from './MessageComposer'
import MessageListItem from './MessageListItem'
import TypingListItem from './TypingListItem'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import { addIncomingMessage, postMessage, showOthersTyping, showOthersTypingStopped, newUserJoined, userExit, leaveChat } from '../../../actions/chat'

class Chat extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor (props, context) {
    super(props, context)
    this.state = {
      messages: [],
      typer: ''
    }
  }
  componentDidMount () {
    const { socket } = this.props
    // TODO: LOAD MESSAGES socket.on(load_messages), socket.emit(load_messages)
    socket.on('add_message', (msg) => {
      this.props.addIncomingMessage(msg)
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
  }
  componentDidUpdate () {
    const messageList = this.refs.messageList
    messageList.scrollTop = messageList.scrollHeight
  }
  componentWillUnmount () {
      // Remove all listeners that depends on the mount state of the component
    this.props.socket.off('add_message')
    this.props.socket.off('typing')
    this.props.socket.off('stop_typing')
    this.props.socket.off('join_room')
    this.props.socket.off('exit_room')
  }

  handleClickOnUser (user) {

  }

  leaveChat () {
    this.props.leaveChat()
    browserHistory.push('/')
  }

  render () {
    const { socket, activeChannel, postMessage } = this.props

    const bodyStyle = {
      height: `${0.9 * (window.innerHeight - 72 - 64 - 10)}px`
    }
    const footerStyle = {
      height: `${0.1 * (window.innerHeight - 72 - 64 - 10)}px`
    }
    const generateMessages = () =>
      this.props.chat.messages.map((message, i) => {
        if (message.userId === socket.id) {
          return <MessageListItem key={i} messageType='my-message' handleClickOnUser={::this.handleClickOnUser} message={message} />
        } else if (message.messageType === 'user-joined' || message.messageType === 'user-exited') {
            // Not a message- user joined
          if (!(message.messageType === 'user-exited' && message.data.userId === socket.id)) {
            return <MessageListItem key={i} messageType={message.messageType} handleClickOnUser={::this.handleClickOnUser} message={message} />
          }
        } else {
          return <MessageListItem key={i} messageType='others-message' handleClickOnUser={::this.handleClickOnUser} message={message} />
        }
      }
      )

    const generatePendingMessages = () =>
      this.props.chat.pendingMessages.map((message, i) =>
        <MessageListItem key={i} messageType='pending' handleClickOnUser={::this.handleClickOnUser} message={message} />
      )

    return (
      <div style={{ padding: '0', height: '100%', width: '100%', display: '-webkit-box' }}>
        <div className='chat-main'>
          <header className='chat-title-div'>
            <span className='chat-title'>
              {activeChannel.roomName}
            </span>
            <RaisedButton className='pull-right' label='Leave Room' onTouchTap={() => this.leaveChat()} />
          </header>
          <Divider />

          <ul className='chat-body' style={bodyStyle} ref='messageList' >
            { generateMessages() }
            { generatePendingMessages() }
          </ul>

          <div className='chat-footer' style={footerStyle}>
            <MessageComposer socket={socket} activeChannel={activeChannel} postMessage={postMessage} />
            <div style={{ flexShrink:'0', fontSize: '1em', width: '100%', opacity: '0.5' }}>
              {this.props.chat.typer !== '' &&
                <div className='pull-right'>
                  <span>
                    <TypingListItem username={this.props.chat.typer} />
                    <span> is typing</span>
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { chat } = state
  return {
    chat
  }
}

const mapDispatch = {
  addIncomingMessage,
  postMessage,
  showOthersTyping,
  showOthersTypingStopped,
  newUserJoined,
  userExit,
  leaveChat
}

export default connect(mapStateToProps, mapDispatch)(Chat)

