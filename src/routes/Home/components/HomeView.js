import React, { Component } from 'react'
import './HomeView.scss'

class HomeView extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      username: ''
    }
  }

  render () {
    const { screenWidth } = this.props
    return (
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <header style={{ textAlign: 'center' }}>
          <p>Welcome to Bubble Chat</p>
        </header>
      </div>
    )
  }
}

export default HomeView
