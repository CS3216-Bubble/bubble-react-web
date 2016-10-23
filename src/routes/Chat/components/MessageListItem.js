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
    if (messageType==="my-message") {
      return (
        <li className="my-message row">
          <div className="talk-bubble round pull-right">
            <div className="message">{message.message}</div>
          </div>
        </li>
      );
    } else if (messageType==='user-joined') {
        return (
          <li className="row">
            <div>
              <div className="user-joined-message">{message.user} joined</div>
            </div>
          </li>
        );
    } else {
      return (
        <li className="others-message row">
          <div className="talk-bubble round">
            <span>
              <b><button className="username-btn" onClick={this.handleClick.bind(this, message.userId)}>{message.userId}</button></b>
            </span>
            <div className="message">{message.message}</div>
          </div>
        </li>
      );
    }
  }
}
