/**
* Entry Script
*/

// Babel polyfill to convert ES6 code in runtime
require('babel-register')({
  "plugins": [
    [
      "babel-plugin-webpack-loaders",
      {
        "config": "./webpack.config.babel.js",
        "verbose": false
      }
    ]
  ]
});
require('babel-polyfill');

require('./server/testMongo');
