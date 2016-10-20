import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import _ from 'lodash';

import { addChat, loadChats, joinChat } from '../actions/chats';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      sideBarOpen: true,
      chat: {
        user: '',
        roomName: '',
        roomDescription: '',
        userLimit: '',
        categories: '',
      },
      addChatModal: false,
    };
  }

  componentDidMount() {
    var _self = this;
    _self.props.chats.socket.on('list_rooms', function(msg) {
      console.log('listing rooms:');
      console.log(msg);
      _self.props.loadChats(msg);
    });
    _self.props.chats.socket.emit('list_rooms');
  }

  handleToggle = () => this.setState({addChatOpen: !this.state.addChatOpen});

  openAddChatModal = (event) => {
    event.preventDefault();
    this.setState({addChatModal: true});
  }
  closeAddChatModal = (event) => {
    this.setState({addChatModal: false});
  }

  joinChat = (chat) => {
    // TODO: add action to add active chat into reducer
    this.props.chats.socket.emit('join_room', {
      roomId: chat.roomId,
    });
    console.log('chat', chat);
    this.props.joinChat(chat);
    browserHistory.push('/chat');
    console.log('join chat', chat.roomId);
  }

  handleModalRoomNameChange = (event) => {
    console.log('render chats', this.props.chats);
    this.setState({chat: _.extend(this.state.chat, {roomName: event.target.value}) });
  }
  handleModalRoomDescriptionChange = (event) => {
    this.setState({chat: _.extend(this.state.chat, {roomDescription: event.target.value}) });
  }
  handleModalUserLimitChange = (event) => {
    this.setState({chat: _.extend(this.state.chat, {userLimit: event.target.value}) });
  }
  handleModalSubmit = () => {
    var newChat = this.state.chat;
    // this.handleChangeChat(newChat);
    this.props.chats.socket.emit('create_room', newChat);
    this.props.chats.socket.on('create_room', (msg) => {
      newChat.roomId = msg.roomId
    });
    this.props.addChat(newChat);
    this.setState({chat: {
        user: '',
        roomName: '',
        roomDescription: '',
        userLimit: '',
        categories: '',
      }});
    this.closeAddChatModal();
  }
  validateChatName = () => {
    var chats = this.props.chats.data;
    if (chats.filter(chat => {
      return chat.roomName === this.state.chat.roomName.trim();
    }).length > 0) {
      return 'error';
    }
    return 'success';
  }
  validateUserLimit = () => {
    var pattern = /^[0-9]+$|^$/; // get whole numbers
    if (pattern.test(this.state.chat.userLimit)) {
      return 'success';
    } else {
      return 'error';
    }
  }

  render () {
    const { routes, store } = this.props
    const newChatActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeAddChatModal}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={this.validateChatName() === 'error' || 'true' && this.validateUserLimit() === 'error'}
        onTouchTap={this.handleModalSubmit}
      />,
    ]
    const newChatModal = (
      <div>
        <Dialog open={this.state.addChatModal} title="Add New Chat" modal={true} actions={newChatActions}>
          <TextField
            errorText={this.validateChatName() === 'error' && 'A chat with that name already exists!'}
            onChange={::this.handleModalRoomNameChange}
            floatingLabelText="Name"
            value={this.state.chat.roomName}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            onChange={::this.handleModalRoomDescriptionChange}
            value={this.state.chat.roomDescription}
          />
          <br />
          <TextField
            errorText={this.validateUserLimit() === 'error' && 'User limit must be a number!'}
            floatingLabelText="User Limit"
            onChange={::this.handleModalUserLimitChange}
            value={this.state.chat.userLimit}
          />
          <br />
        </Dialog>
      </div>
    );

    // TODO: make the nav bar reactive, smaller screen should hide nav bar and change size of chat
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Bubble"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
            />
            <Drawer open={this.state.sideBarOpen}>
              <div className="sidebar-header">Bubble</div> 
              <div className="row">
                <div className="col-xs-8">
                  <TextField
                    hintText="Hint Text"
                    floatingLabelText="Search"
                  />
                </div>
                <div className="col-xs-3">
                  <div className="div-create-chat">
                    <IconButton onClick={::this.openAddChatModal} tooltip="Create chat" tooltipPosition="top-left">
                      <i className="material-icons">mode_edit</i>
                    </IconButton>
                  </div>
                </div>
              </div>
              {this.props.chats.data.map(chat =>
                <MenuItem onTouchTap={() => this.joinChat(chat)} key={chat.roomId}>{chat.roomName}</MenuItem>
              )}
            </Drawer>
            {newChatModal}
            <div className="div-main">
              <Router history={browserHistory} children={routes} />
            </div>
          </div>
        </MuiThemeProvider> 
      </Provider>
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
  addChat,
  loadChats,
  joinChat,
};

export default connect(mapStateToProps, mapDispatch)(AppContainer)
