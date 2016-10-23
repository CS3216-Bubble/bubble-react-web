import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { joinChat } from '../../../actions/chats';
import { browserHistory } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';

class ViewChat extends Component {

  static propTypes = {
    chat: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
  }

  joinChat = (chat) => {
    // Do nothing if user clicks active chat
    if (this.props.chats.activeChannel.roomId === chat.roomId) {
      return;
    }

    this.props.socket.emit('join_room', {
      roomId: chat.roomId,
    });
    this.props.joinChat(chat);
    browserHistory.push('/chat');
  }


  render() {
    console.log('chat', this.props.chat);
    const generateCategoriesChips = () => {
      const categoryChips = [];
      this.props.chat.categories.map( (cat, i) => {
        categoryChips.push(<Chip className="chip" key={i} >{cat}</Chip>)
      });
      return categoryChips;
    }

    return (
      <div style={{ height: '100%', width: '100%'}}>
        <header className="chat-title-div">
          <span className="chat-title">
          {this.props.chat.roomName}
          </span>
        </header>
        <Divider />
        <div style={{ padding: '15px' }}>
          <div>
            <span>Description</span>
            <span>{this.props.chat.roomDescription}</span>
          </div>
          <div>
            <span>Categories</span>
            <span>{ generateCategoriesChips() }</span>
          </div>
          <div>
            <span>Room Type</span>
            <span>{this.props.chat.roomType}</span>
          </div>
          <div>
            <div>User Limit</div>
            <div>{this.props.chat.userLimit}</div>
          </div>
          <div>
            <div>Number of Users</div>
            <div>{this.props.chat.numUsers}</div>
          </div>
          <div>
            <div>Last Active</div>
            <div>{this.props.chat.lastActive}</div>
          </div>
          <RaisedButton onTouchTap={() => this.joinChat(this.props.chat)} label="Join Chat" primary={true} fullWidth={true}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { chats } = state;
  return {
    chats,
  }
}

const mapDispatch = {
  joinChat,
};

export default connect(mapStateToProps, mapDispatch)(ViewChat)

