const express = require('express');
const path    = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const server       = express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const port         = isDeveloping ? 3000 : process.env.PORT;

if(isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  server.use(middleware);
  server.use(webpackHotMiddleware(compiler));
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
} else {
  server.use(express.static(path.join(__dirname, 'public')));
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

server.listen(port, '0.0.0.0', (err) => {
  if(err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
