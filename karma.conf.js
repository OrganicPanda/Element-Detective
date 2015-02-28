module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/detective-es5-global.js',
      'test/**/*Spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO, // config.LOG_DEBUG
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
