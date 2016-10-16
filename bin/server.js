const config = require('../webpack.config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')
const open = require('open');

const port = 8000;

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

server.listen(port)
debug(`Server is now running at http://localhost:${port}.`)

let target_entry = 'http://localhost:' + port + '/';

new WebpackDevServer(webpack(config), {contentBase: 'src', hot: true, stats: { colors: true }, publicPath: '/assets/'})
.listen(port, 'localhost' , (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + port );
  console.log('Opening your system browser...');
  open(target_entry);
});