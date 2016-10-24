import React, { Component, PropTypes } from 'react';

export default class MessageListItem extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    messageType: PropTypes.string.isRequired,
  };
  handleClick(user) {
    this.props.handleClickOnUser(user);
  }
  render() {
    const { message, messageType } = this.props;
    console.log('message', message);
    if (messageType==="my-message") {
      return (
        <li className="my-message row">
          <div className="talk-bubble round pull-right">
            <div className="message">{ message.message || message.content }</div>
          </div>
        </li>
      );
    } else if (messageType==='pending') {
        return (
          <li className="my-message row">
            <div className="talk-bubble round pull-right transparent-bg">
              <div className="message">{ message.message || message.content }</div>
            </div>
          </li>
        );
    } else if (messageType==='others-message') {
      return (
        <li className="others-message row">
          <div className="talk-bubble round">
            <span>
              <b><button className="username-btn" onClick={this.handleClick.bind(this, message.userId)}>{message.userId }</button></b>
            </span>
            <div className="message">{message.message || message.content }</div>
          </div>
        </li>
      );
    } else if (messageType==='user-joined') {
        return (
          <li className="row">
            <div>
              <div className="user-joined-message">{message.data.userId} joined</div>
            </div>
          </li>
        );
    } else if (messageType==='user-exited' && message.data.userId) {
        return (
          <li className="row">
            <div>
              <div className="user-exited-message">{message.data.userId} left</div>
            </div>
          </li>
        );
    }
  }
}
