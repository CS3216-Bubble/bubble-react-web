import React, { Component, PropTypes } from 'react'
import Chat from '../components/Chat'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

class ChatContainer extends Component {

  componentWillMount () {
    if (_.isEmpty(this.props.activeChannel)){
      browserHistory.push('/')
    }
  }

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
