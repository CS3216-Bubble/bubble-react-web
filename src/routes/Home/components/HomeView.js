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
            <p style={{paddingTop: 30, fontSize: 36, fontFamily: 'Dosis', color: '#69D2E7'}}>Welcome to</p>
            <img src={require('../../../images/logo_img_blue.png')} style={{height: 80}}/><br/>
            <div style={{ display: 'flex', flex: 1,justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start' }}>
                <img src={require('../../../images/welcome.png')} style={{width: 400, objectFit: 'contain'}}/>
            </div>
        </header>
      </div>
    )
  }
}

export default HomeView
