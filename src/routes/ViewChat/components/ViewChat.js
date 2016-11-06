import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { joinChat } from '../../../actions/chats'
import { browserHistory } from 'react-router'
import Moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip'

class ViewChat extends Component {

  static propTypes = {
    chat: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor (props, context) {
    super(props, context)
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
          <Chip className='chip' key={i} >{cat}</Chip>
        )
      }
      return (<h4>No Categories</h4>)
    }

    const createdBySection = () => {
      if (this.props.chat.createdByBubbleUsername) {
        return (
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Created By:</b></h4>
            <h4 className='col-md-9'>{this.props.chat.createdByBubbleUsername}</h4>
          </div>
        )
      } else if (this.props.chat.createdByUsername) {
        return (
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Created By:</b></h4>
            <h4>{this.props.chat.createdByUsername}</h4>
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
        <div style={{ padding: '15px' }}>
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Description:</b></h4>
            <h4 className='col-md-9'>{this.props.chat.roomDescription ? this.props.chat.roomDescription : 'No Description' }</h4>
          </div>
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Categories:</b></h4>
            <div className='col-md-9' style={{ display: 'flex', flexWrap: 'wrap' }}>
              { generateCategoriesChips() }
            </div>
          </div>
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Room Type:</b></h4>
            <h4 className='col-md-9'>{this.props.chat.roomType}</h4>
          </div>
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>User Limit:</b></h4>
            <h4 className='col-md-9'>{this.props.chat.userLimit}</h4>
          </div>
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Number of Users:</b></h4>
            <h4 className='col-md-9'>{this.props.chat.numUsers}</h4>
          </div>
          { createdBySection() }
          <div className='row'>
            <h4 className='col-md-3 right-label'><b>Last Active:</b></h4>
            <h4 className='col-md-9'>{Moment(this.props.chat.lastActive).format('Do MMM YYYY, h:mm a')}</h4>
          </div>
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

