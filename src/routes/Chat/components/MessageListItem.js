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
    if (messageType === 'my-message') {
      return (
        <li className='my-message row'>
          <div className='talk-bubble round pull-right'>
            <div>
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
            <div>
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
              <div className='col-xs-3'>
                <img style={bigImageStyle} src= {'http://flathash.com/' + (message.userId ?  message.userId : '1') } alt="" />
              </div>
              <div className='col-xs-9'>
                <span>
                  <b><button className='username-btn' onClick={this.handleClick.bind(this, message.username)}>{message.username }</button></b>
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
            <img style={smallImageStyle} src= {'http://flathash.com/' + (message.data.userId ?  message.data.userId : '1') } alt="" />
            {message.data.username} joined
          </div>
        </li>
        )
    } else if (messageType === 'user-exited' && message.data.userId) {
      return (
        <li className='row'>
          <div className='user-exited-message'>
            <img style={smallImageStyle} src= {'http://flathash.com/' + (message.data.userId ?  message.data.userId : '1') } alt="" />
            {message.data.username} left
          </div>
        </li>
        )
    }
  }
}
