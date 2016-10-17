import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import io from 'socket.io-client';

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
      chatName: '',
      addChatModal: false,
    };
  }

  handleToggle = () => this.setState({addChatOpen: !this.state.addChatOpen});

  openAddChatModal = (event) => {
    console.log('add chat pressed');
    event.preventDefault();
    this.setState({addChatModal: true});
    console.log(this.state.addChatModal);
  }
  closeAddChatModal = (event) => {
    console.log('close tapped');
    event.preventDefault();
    this.setState({addChatModal: false});
  }
  handleModalChange = (event) => {
    this.setState({chatName: event.target.value});
  }
  handleModalSubmit = (event) => {
    // const { dispatch } = this.props;
    event.preventDefault();

    const newChat = {
      name: this.state.chatName.trim(),
      id: `${Date.now()}${uuid.v4()}`,
      private: false
    };
    // dispatch(actions.createChat(newChat));
    this.handleChangeChat(newChat);
    socket.emit('new chat', newChat);
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
    // return 'success';
    return 'success';
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
        disabled={this.validateChatName() === 'error' && 'true'}
        onTouchTap={this.handleModalSubmit}
      />,
    ]
    const newChatModal = (
      <div>
        <Dialog open={this.state.addChatModal} title="Add New Chat" modal={true} actions={newChatActions}>
          <form onSubmit={::this.handleModalSubmit} >
          <TextField
            errorText={this.validateChatName() === 'error' && 'A chat with that name already exists!'}
            floatingLabelText="Chat Name"
            value={this.state.chatName}
            onChange={::this.handleModalChange}
          />
          </form>
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
