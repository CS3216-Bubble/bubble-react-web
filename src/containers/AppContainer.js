import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import moment from 'moment'

import { initEnvironment } from '../actions/environment'
import { addChat, loadChats, viewChat, joinChat, addChatRoomId, toggleCategory } from '../actions/chats'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import {red400, pink200, purple300, lightBlue300, amber300, orange400, grey50 } from 'material-ui/styles/colors';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      sideBarOpen: false,
      chat: {
        user: '',
        roomName: '',
        roomDescription: '',
        userLimit: '',
        categories: []
      },
      addChatModal: false,
      categories: ['Rant', 'Funny', 'Nostalgia', 'Relationship', 'Advice', 'School'],
      searchTerm: '',
      categoryColors: {
        'Rant': red400,
        'Funny': amber300,
        'Nostalgia': orange400,
        'Relationship': pink200,
        'Advice': purple300,
        'School': lightBlue300,
      },
      categoryFilter: {
        'Rant': false,
        'Funny': false,
        'Nostalgia': false,
        'Relationship': false,
        'Advice': false,
        'School': false
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.chats.data !== nextProps.chats.data) {
      clearTimeout(this.timeout)
      this.startPoll()
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  componentDidMount () {
    var _self = this
    _self.props.initEnvironment()
    _self.props.chats.socket.on('list_rooms', function (msg) {
      _self.props.loadChats(msg)
    })
    _self.props.chats.socket.emit('list_rooms')
    _self.props.chats.socket.on('create_room', function (msg) {
      _self.props.addChatRoomId(msg.roomId)
      browserHistory.push('/chat')
    })
    _self.props.chats.socket.on('view_room', function (chat) {
      _self.props.viewChat(chat)
      browserHistory.push('/view-chat')
    })
  }

  startPoll = () => {
    this.timeout = setTimeout(() => this.props.chats.socket.emit('list_rooms'), 2000)
  }

  handleSideBarToggle = () => {
    this.setState({ sideBarOpen: !this.state.sideBarOpen })
  }

  handleToggle = () => this.setState({ addChatOpen: !this.state.addChatOpen });

  openAddChatModal = (event) => {
    event.preventDefault()
    this.setState({ addChatModal: true })
  }
  closeAddChatModal = (event) => {
    this.setState({ addChatModal: false })
  }

  viewChat = (chat) => {
    // Do nothing if user clicks active chat
    if (this.props.chats.activeChannel.roomId === chat.roomId) {
      return
    }

    this.props.chats.socket.emit('view_room', {
      roomId: chat.roomId,
      userId: this.props.chats.socket.id
    })
  }

  joinChat = (chat) => {
    // Do nothing if user clicks active chat
    if (this.props.chats.activeChannel.roomId === chat.roomId) {
      return
    }
    this.props.joinChat(chat)
    browserHistory.push('/chat')
  }

  handleModalRoomNameChange = (event) => {
    this.setState({ chat: _.extend(this.state.chat, { roomName: event.target.value }) })
  }
  handleModalRoomDescriptionChange = (event) => {
    this.setState({ chat: _.extend(this.state.chat, { roomDescription: event.target.value }) })
  }
  handleModalUserLimitChange = (event) => {
    this.setState({ chat: _.extend(this.state.chat, { userLimit: event.target.value }) })
  }
  handleModalSubmit = () => {
    var newChat = this.state.chat
    this.props.chats.socket.emit('create_room', newChat)
    this.props.chats.socket.on('create_room', (msg) => {
      newChat.roomId = msg.roomId
    })
    this.props.addChat(newChat)
    this.setState({ chat: {
      user: '',
      roomName: '',
      roomDescription: '',
      userLimit: '',
      categories: []
    } })
    this.closeAddChatModal()
  }
  validateChatName = () => {
    const chats = _.concat(this.props.chats.joinedRooms, this.props.chats.otherRooms)
    if (chats.filter(chat => {
      if (chat) {
        return chat.roomName === this.state.chat.roomName.trim()
      }
    }).length > 0) {
      return 'error'
    }
    return 'success'
  }
  validateUserLimit = () => {
    var pattern = /^[0-9]+$|^$/ // get whole numbers
    if (pattern.test(this.state.chat.userLimit)) {
      return 'success'
    } else {
      return 'error'
    }
  }

  render () {
    const { screenHeight, isMobile, screenWidth } = this.props.environment

    // console.log(screenWidth, screenHeight);

    const { routes, store } = this.props

    const newChatActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.closeAddChatModal}
      />,
      <FlatButton
        label='Submit'
        primary
        disabled={this.validateChatName() === 'error' || 'true' && this.validateUserLimit() === 'error'}
        onTouchTap={this.handleModalSubmit}
      />
    ]

    const generateCheckboxes = () =>
      this.state.categories.map((cat, i) =>
        <Checkbox key={i} label={cat} className='checkbox' onCheck={(event, bool) => checkboxChecked(bool, cat)} />
      )

    const generateCategoriesChips = () =>
      this.state.categories.map((cat, i) => {
        // enabled
        if (this.props.chats.categoryFilter[cat]) {
          return (
            <Chip
              onTouchTap={() => this.props.toggleCategory(cat)}
              className={classNames('chip', { 'enabled-chip': this.props.chats.categoryFilter[cat] })}
              key={i}
              backgroundColor={this.state.categoryColors[cat]}>
              {cat}
            </Chip>
          );
        } else {
          return (
            <Chip
              onTouchTap={() => this.props.toggleCategory(cat)}
              className={classNames('chip', { 'enabled-chip': this.props.chats.categoryFilter[cat] })}
              key={i}>
              {cat}
            </Chip>
          );
        }
      }

      )

    const generateFilteredJoinedRooms = () => {
      const filters = Object.keys(_.pickBy(this.props.chats.categoryFilter))
      var filteredJoinedRooms = this.props.chats.joinedRooms.filter((chat) => {
        if (!chat) {
          return false
        }

        var pass = true
        filters.forEach((filter) => {
          if (chat.categories.indexOf(filter) < 0) {
            pass = false
          }
        })
        return pass
      })
      if (this.state.searchTerm !== '') {
        filteredJoinedRooms = filteredJoinedRooms.filter( (chat) => {
          if (chat.roomName.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (chat.roomDescription.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
        })
      }

      return filteredJoinedRooms.map(chat =>
        <MenuItem onTouchTap={() => this.joinChat(chat)} key={chat.roomId}>{chat.roomName}</MenuItem>
      )
    }

    const generateHotRooms = () => {
      var hotRooms = this.props.chats.otherRooms.filter((chat) => {
        if (!chat) {
          return false
        }
        return chat.roomType === 'HOT';
      })
      if (this.state.searchTerm !== '') {
        hotRooms = hotRooms.filter( (chat) => {
          if (chat.roomName.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (chat.roomDescription.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
        })
      }

      return hotRooms.map(chat =>
        <MenuItem onTouchTap={() => this.joinChat(chat)} key={chat.roomId}>{chat.roomName}</MenuItem>
      )
    }

    const generateFilteredOtherRooms = () => {
      const filters = Object.keys(_.pickBy(this.props.chats.categoryFilter))
      var filteredOtherRooms = this.props.chats.otherRooms.filter((chat) => {
        if (!chat || chat.roomType === 'HOT') {
          return false
        }

        var pass = true
        filters.forEach((filter) => {
          if (chat.categories.indexOf(filter) < 0) {
            pass = false
          }
        })
        return pass
      })

      if (this.state.searchTerm !== '') {
        filteredOtherRooms = filteredOtherRooms.filter( (chat) => {
          if (chat.roomName.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (chat.roomDescription.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1) {
            return true;
          }
        })
      }

      filteredOtherRooms.sort((a, b) => {
        return (new Date(b.lastActive)) - (new Date(a.lastActive));
      })

      return filteredOtherRooms.map(chat =>
        <MenuItem onTouchTap={() => this.viewChat(chat)} key={chat.roomId}>{chat.roomName}</MenuItem>
      )
    }

    const checkboxChecked = (bool, cat) => {
      if (bool) {
        this.state.chat.categories.push(cat)
      } else {
        this.state.chat.categories.splice(this.state.chat.categories.indexOf(cat))
      }
    }

    const newChatModal = (
      <div>
        <Dialog open={this.state.addChatModal} title='Add New Chat' modal actions={newChatActions}>
          <TextField
            style={{ width: `100%` }}
            errorText={this.validateChatName() === 'error' && 'A chat with that name already exists!'}
            onChange={::this.handleModalRoomNameChange}
            floatingLabelText='Name'
            value={this.state.chat.roomName}
          />
          <br />
          <TextField
            style={{ width: `100%` }}
            floatingLabelText='Description'
            onChange={::this.handleModalRoomDescriptionChange}
            value={this.state.chat.roomDescription}
          />
          <br />
          <TextField
            style={{ width: `100%` }}
            errorText={this.validateUserLimit() === 'error' && 'User limit must be a number!'}
            floatingLabelText='User Limit'
            onChange={::this.handleModalUserLimitChange}
            value={this.state.chat.userLimit}
          />
          <br />
          <div style={{ width: `100%` }}>
            { generateCheckboxes() }
          </div>
        </Dialog>
      </div>
    )

    // TODO: make the nav bar reactive, smaller screen should hide nav bar and change size of chat
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <div style={{ height: `90%` }} >
            <AppBar
              title='Bubble'
              iconClassNameRight='muidocs-icon-navigation-expand-more'
              onLeftIconButtonTouchTap={this.handleSideBarToggle}
            />
            <Drawer className='drawer' docked={this.props.environment.screenWidth > 500} open={this.props.environment.screenWidth > 500 || this.state.sideBarOpen} onRequestChange={(open) => this.setState({ sideBarOpen: open })}>
              <div className='sidebar-header'>Bubble</div>
              <div className='sidebar-content'>
                  <RaisedButton label="Create Chat" primary={true} fullWidth={true} onClick={::this.openAddChatModal}/>
                    <TextField
                      id="text-field-controlled"
                      name="adjlkadlf"
                      hintText='Search for chats...'
                      floatingLabelText='Search'
                      fullWidth={true}
                      value={this.state.searchTerm}
                      onChange={(event) => this.setState({searchTerm: event.target.value})}
                    />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {generateCategoriesChips()}
                </div>
                <h5>Joined Rooms</h5>
                <Divider />
                {generateFilteredJoinedRooms()}
                <h5>Sticky Rooms</h5>
                <Divider />
                {generateHotRooms()}
                <h5>Other Rooms</h5>
                <Divider />
                {generateFilteredOtherRooms()}
              </div>
            </Drawer>
            {newChatModal}
            <div className='div-main'>
              <Router history={browserHistory} children={routes} />
            </div>
          </div>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

function mapStateToProps (state) {
  const { chats, environment } = state
  return {
    chats,
    environment
  }
}

const mapDispatch = {
  addChat,
  loadChats,
  joinChat,
  viewChat,
  addChatRoomId,
  toggleCategory,
  initEnvironment
}

export default connect(mapStateToProps, mapDispatch)(AppContainer)
