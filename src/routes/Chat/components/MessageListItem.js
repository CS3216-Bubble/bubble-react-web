import React, { Component, PropTypes } from 'react'

export default class MessageListItem extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    messageType: PropTypes.string.isRequired
  };
  handleClick (user) {
    this.props.handleClickOnUser(user)
  }
  render () {
    const { message, messageType } = this.props
    const bigImageStyle = {
      width: '45px',
      height: '45px',
    }
    const smallImageStyle = {
      width: '25px',
      height: '25px',
      marginTop: '-5px',
      marginRight: '10px',
    }

    if (message.messageType == 'REACTION' && message.content == 'THANK') {
      return (
        <li className='row'>
          <div className='user-exited-message'>
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.bubbleId ?  message.bubbleId : (message.userId || '1')) } alt="" />
            {message.username} thanked {message.targetUsername} 
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.targetUser ?  message.targetUser : '1') } alt="" />
          </div>
        </li>
      )
    } else if (message.messageType == 'REACTION' && message.content == 'CHEER') {
      return (
        <li className='row'>
          <div className='user-exited-message'>
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.bubbleId ?  message.bubbleId : (message.userId || '1')) } alt="" />
            {message.username} cheered {message.targetUsername} 
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.targetUser ?  message.targetUser : '1') } alt="" />
          </div>
        </li>
      )
    } else if (messageType === 'my-message') {
      return (
        <li className='my-message row'>
          <div className='talk-bubble round pull-right'>
            <div style={{float:'right'}}>
              <b>{message.username}</b>
            </div>
            <div className='message'>{ message.message || message.content }</div>
          </div>
        </li>
      )
    } else if (messageType === 'pending') {
      return (
        <li className='my-message row'>
          <div className='talk-bubble round pull-right transparent-bg'>
            <div style={{float:'right'}}>
              <b>{message.username}</b>
            </div>
            <div className='message'>{ message.message || message.content }</div>
          </div>
        </li>
        )
    } else if (messageType === 'others-message') {
      return (
        <li className='others-message row'>
          <div className='talk-bubble round'>
            <div className='row'>
              <div className='col-md-1'>
                <img style={bigImageStyle} src= {'https://flathash.com/' + (message.bubbleId ?  message.bubbleId : (message.userId || '1')) } alt="" />
              </div>
              <div className='col-md-11'>
                <span>
                  <b><button className='username-btn' onClick={this.handleClick.bind(this, {username: message.username, userId: message.userId, bubbleId: message.bubbleId})}>{message.username }</button></b>
                </span>
                <div className='message'>{message.message || message.content }</div>
              </div>
            </div>
          </div>
        </li>
      )
    } else if (messageType === 'user-joined') {
      return (
        <li className='row'>
          <div className='user-joined-message'>
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.bubbleId ?  message.bubbleId : (message.userId || '1')) } alt="" />
            {message.data.username} joined
          </div>
        </li>
        )
    } else if (messageType === 'user-exited' && ( message.data.bubbleId || message.data.userId) ) {
      return (
        <li className='row'>
          <div className='user-exited-message'>
            <img style={smallImageStyle} src= {'https://flathash.com/' + (message.bubbleId ?  message.bubbleId : (message.userId || '1')) } alt="" />
            {message.data.username} left
          </div>
        </li>
        )
    }
  }
}
