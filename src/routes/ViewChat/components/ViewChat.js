import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { joinChat } from '../../../actions/chats'
import { browserHistory } from 'react-router'
import Moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip'
import {red400, pink200, purple300, lightBlue300, amber300, orange400, grey50 } from 'material-ui/styles/colors';

class ViewChat extends Component {

  static propTypes = {
    chat: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
        categoryColors: {
          'Rant': red400,
          'Funny': amber300,
          'Nostalgia': orange400,
          'Relationship': pink200,
          'Advice': purple300,
          'School': lightBlue300,
        }
    }
  }

  componentWillMount () {
    if (!this.props.chat.roomId) {
      browserHistory.push('/')
    }
  }

  joinChat = (chat) => {
    // Do nothing if user clicks active chat
    if (this.props.chats.activeChannel.roomId === chat.roomId) {
      return
    }

    this.props.socket.emit('join_room', {
      roomId: chat.roomId,
      bubbleId: this.props.chats.bubbleId,
    })
    this.props.joinChat(chat)
    browserHistory.push('/chat')
  }

  render () {
    const generateCategoriesChips = () => {
      if (this.props.chat.categories && this.props.chat.categories.length > 0) {
        return this.props.chat.categories.map((cat, i) =>
          <Chip className='chip' key={i} backgroundColor={this.state.categoryColors[cat]} labelStyle={{color: 'white'}}>{cat}</Chip>
        )
      }
      return [];
    }

    const createdBySection = () => {
      if (this.props.chat.createdByBubbleUsername) {
        return (
          <div style={{ marginBottom: 15 }}>
            Created by: {this.props.chat.createdByBubbleUsername}
          </div>
        )
      } else if (this.props.chat.createdByUsername) {
        return (
          <div style={{ padding: '15px 15px 50px 15px' }}>
            Created by: {this.props.chat.createdByUsername}
          </div>
        )
      }
    }

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <header className='chat-title-div'>
          <div style={{textAlign:'center'}}>
            <span className='chat-title'>
              {this.props.chat.roomName}
            </span>
          </div>
        </header>
        <Divider />
        <div style={{ padding: '15px 15px 50px 15px' }}>
          {this.props.chat.roomDescription ?
          <div className='chat-description'>
            { this.props.chat.roomDescription }
          </div>
          : '' }
          {this.props.chat.categories.length > 0 ?
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', paddingTop: 10 }}>
              { generateCategoriesChips() }
            </div>
          </div>
          : '' }
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                Last active: {Moment.duration(Moment().diff(Moment(this.props.chat.lastActive))).humanize()} ago
              </div>
              <div>
                {this.props.chat.numUsers} / {this.props.chat.userLimit} users
              </div>
          </div>
          { createdBySection() }
          { this.props.chat.numUsers < this.props.chat.userLimit ?
            <RaisedButton onTouchTap={() => this.joinChat(this.props.chat)} label='Join Chat' primary fullWidth />
              :
                <RaisedButton disabled label='Room Full' style={{ backgroundColor: `red` }} secondary fullWidth />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { chats } = state
  return {
    chats
  }
}

const mapDispatch = {
  joinChat
}

export default connect(mapStateToProps, mapDispatch)(ViewChat)
