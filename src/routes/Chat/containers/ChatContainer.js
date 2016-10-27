import React, { Component, PropTypes } from 'react'
import Chat from '../components/Chat'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class ChatContainer extends Component {

  render () {
    return (
      <Chat activeChannel={this.props.activeChannel} socket={this.props.socket} />
    )
  }

}

function mapStateToProps (state) {
  const { chats } = state
  return {
    activeChannel: chats.activeChannel,
    socket: chats.socket
  }
}
export default connect(mapStateToProps)(ChatContainer)
