import React, { Component, PropTypes } from 'react';
import ViewChat from '../components/ViewChat';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ViewChatContainer extends Component {

  render() {
    return (
      <ViewChat chat={this.props.chat} socket={this.props.socket} />
    );
  }
  
}

function mapStateToProps(state) {
  const { chats } = state;
  return {
    chat: chats.viewChat,
    socket: chats.socket,
  }
}
export default connect(mapStateToProps)(ViewChatContainer)
