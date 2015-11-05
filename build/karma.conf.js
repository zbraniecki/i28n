module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['mocha', 'chai', 'fixture'],
    files: [
      '../dist/build-i28n.js',
      '../test/integration/*.js',
      '../test/fixtures/*.html',
    ],
    preprocessors: {
      '../test/**/*.html'   : ['html2js'],
      '../test/**/*.json'   : ['json_fixtures']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    plugins: [
      'karma-fixture',
      'karma-json-fixtures-preprocessor',
      'karma-html2js-preprocessor',
      'karma-chai',
      'karma-firefox-launcher',
      'karma-mocha',
    ],
  });
};
