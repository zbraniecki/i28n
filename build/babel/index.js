'use strict';

var bundler = require('./bundler');

module.exports = {
  web: {
    options: {
      plugins: bundler,
      whitelist: ''
    },
    files: {
      'dist/web/i28n.js': 'src/runtime/web/index.js'
    }
  }
};
