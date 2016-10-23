export default (store) => ({
  path : 'view-chat',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ViewChat = require('./containers/ViewChatContainer').default

      /*  Return getComponent   */
      cb(null, ViewChat)

    /* Webpack named bundle   */
    }, 'view-chat')
  }
})
