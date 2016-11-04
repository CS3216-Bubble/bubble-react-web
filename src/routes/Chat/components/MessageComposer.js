import React, { Component, PropTypes } from 'react'
import { FormControl } from 'react-bootstrap'
import { postMessage } from '../../../actions/chat'
import EmojiPicker from 'emojione-picker';

export default class MessageComposer extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    postMessage: PropTypes.func.isRequired
  };
  constructor (props, context) {
    super(props, context)
    this.state = {
      text: '',
      typing: false,
      openEmojiPicker: false,
    }
  }
  handleSubmit (event) {
    const { socket, activeChannel, postMessage } = this.props
    const message = event.target.value.trim()
    if (event.which === 13 && message != '') {
      event.preventDefault()
      // TODO: make the userId retrievable from backend when persisting user
      var newMessage = {
        roomId: this.props.activeChannel.roomId,
        message,
        userId: socket.id
      }
      socket.emit('add_message', newMessage)
      postMessage(newMessage)
      socket.emit('stop_typing', { roomId: activeChannel.roomId })
      this.setState({ text: '', typing: false })
    }
  }
  handleChange (event) {
    const { socket, user, activeChannel } = this.props
    this.setState({ text: event.target.value })
    if (event.target.value.length > 0 && !this.state.typing) {
      socket.emit('typing', { roomId: activeChannel.roomId })
      this.setState({ typing: true })
    }
    if (event.target.value.length === 0 && this.state.typing) {
      socket.emit('stop_typing', { roomId: activeChannel.roomId })
      this.setState({ typing: false })
    }
  }
  render () {
    const emojiPicker = (        
      <EmojiPicker search={true} onChange={(data) => {
        let char = eval('"\\u{' + data.unicode + '}"')
        this.setState({
          text: this.state.text + char + ' ',
          openEmojiPicker: false,
        })
      }} />
    )

    return (
      <div className='chat-message-field'>
        <div style={{width:'10%'}}>
          <button className='emoji-button' onTouchTap={(event) => this.setState({openEmojiPicker: !this.state.openEmojiPicker})}>☺</button>
        </div>
        <FormControl
          className='message-composer'
          type='text'
          autoFocus='true'
          placeholder='Type here to chat!'
          value={this.state.text}
          onChange={::this.handleChange}
          onKeyDown={::this.handleSubmit}
        />
        { this.state.openEmojiPicker ? emojiPicker : [] }
      </div>
    )
  }
}
