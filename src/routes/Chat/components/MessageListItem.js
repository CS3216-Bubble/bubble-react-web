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
        <li className={messageType}>
          <div className="message">{message.message}</div>
        </li>
      );
    } else {
      return (
        <li className={messageType}>
          <span>
            <b className="u" style={{color: '#66c'}}><button className="username-btn" onClick={this.handleClick.bind(this, message.userId)}>{message.userId}</button></b>
          </span>
          <div className="message">{message.message}</div>
        </li>
      );
    }
  }
}
