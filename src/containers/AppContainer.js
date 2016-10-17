import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import io from 'socket.io-client';
import _ from 'lodash';

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

const socket = io('http://localhost:3000');

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
      chatName: '',
      addChatModal: false,
    };
  }

  handleToggle = () => this.setState({addChatOpen: !this.state.addChatOpen});

  openAddChatModal = (event) => {
    event.preventDefault();
    this.setState({addChatModal: true});
  }
  closeAddChatModal = (event) => {
    event.preventDefault();
    this.setState({addChatModal: false});
  }
  handleModalRoomNameChange = (event) => {
    this.setState({chat: _.extend(this.state.chat, {roomName: event.target.value}) });
  }
  handleModalRoomDescriptionChange = (event) => {
    this.setState({chat: _.extend(this.state.chat, {roomDescription: event.target.value}) });
  }
  handleModalUserLimitChange = (event) => {
    this.setState({chat: _.extend(this.state.chat, {userLimit: event.target.value}) });
  }
  handleModalSubmit = (event) => {
    event.preventDefault();
    const newChat = {
      name: this.state.chatName.trim(),
      id: `${Date.now()}${uuid.v4()}`,
      private: false
    };
    this.handleChangeChat(newChat);
    socket.emit('create_room', newChat);
    this.setState({chatName: ''});
    this.closeAddChatModal();
  }
  validateChatName = () => {
    // const { chats } = this.props;
    // if (chats.filter(chat => {
    //   return chat.name === this.state.chatName.trim();
    // }).length > 0) {
    //   return 'error';
    // }
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
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
            {newChatModal}
            <div style={{ height: '100%' }}>
              <Router history={browserHistory} children={routes} />
            </div>
          </div>
        </MuiThemeProvider> 
      </Provider>
    );
  }
}

export default AppContainer
