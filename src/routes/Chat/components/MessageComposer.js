import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { postMessage } from '../../../actions/chat'
import EmojiPicker from 'emojione-picker';

export default class MessageComposer extends Component {

  static propTypes = {
    activeChannel: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    bubbleId: PropTypes.string.isRequired,
    postMessage: PropTypes.func.isRequired
  };
  constructor (props, context) {
    super(props, context)
    this.state = {
      text: '',
      typing: false,
      openEmojiPicker: false,
      time: 500,
    }
  }
  componentDidMount() {
      this.timer = setInterval(this.tick, 50);
  }
  componentWillUnmount (){
      clearInterval(this.timer);
  }
  tick = () => {
      this.setState({time: this.state.time + 50});
  }

  handleKeyDown = (event) => {
    if (event.which === 13) {
      event.preventDefault()
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { socket, activeChannel, postMessage, bubbleId } = this.props
    if (this.state.time > 500) {
      const message = this.state.text.trim();
      if (message === '') {
        return false;
      }
      // TODO: make the userId retrievable from backend when persisting user
      var newMessage = {
        roomId: this.props.activeChannel.roomId,
        message,
        userId: socket.id,
        bubbleId
      }
      socket.emit('add_message', newMessage)
      postMessage(newMessage)
      socket.emit('stop_typing', { roomId: activeChannel.roomId, bubbleId })
      this.setState({ text: '', typing: false, time: 0})
    }
  }
  handleChange (event) {
    const { socket, user, activeChannel, bubbleId } = this.props
    this.setState({ text: event.target.value })
    if (event.target.value.length > 0 && !this.state.typing) {
      socket.emit('typing', { roomId: activeChannel.roomId, bubbleId })
      this.setState({ typing: true })
    }
    if (event.target.value.length === 0 && this.state.typing) {
      socket.emit('stop_typing', { roomId: activeChannel.roomId, bubbleId })
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
          <Button className='emoji-button' onTouchTap={(event) => this.setState({openEmojiPicker: !this.state.openEmojiPicker})}>
      ☺
          </Button>
            <input
              className='message-composer'
              type='text'
              autoFocus='true'
              placeholder='Type here to chat!'
              value={this.state.text}
              onChange={::this.handleChange}
              onKeyDown={::this.handleKeyDown}
            />
          <Button type="submit" className='send-button' onTouchTap={::this.handleSubmit} style={{border: 'none'}}>
            <i className="material-icons">send</i>
          </Button>
        { this.state.openEmojiPicker ? emojiPicker : [] }
      </div>
    )
  }
}
