import React, { Component, PropTypes } from 'react';

export default class MessageListItem extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired
  };
  handleClick(user) {
    this.props.handleClickOnUser(user);
  }
  render() {
    const { message } = this.props;
    return (
      <li>
        <span>
          <b style={{color: '#66c'}}><button style={{background: 'Transparent',backgroundRepeat: 'noRepeat', border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'}} onClick={this.handleClick.bind(this, message.userId)}>{message.userId}</button></b>
        </span>
        <div style={{clear: 'both', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>{message.message}</div>
      </li>
    );
  }
}
