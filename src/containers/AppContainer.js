import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Bubble"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
            />
            <Drawer open={this.state.open}>
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
                    <IconButton tooltip="Create chat" tooltipPosition="top-center">
                      <i className="material-icons">mode_edit</i>
                    </IconButton>
                  </div>
                </div>
              </div>
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
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
