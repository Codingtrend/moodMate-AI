// ✅ C:\Users\paras\moodcast-ai\config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  // ✅ Add fallbacks for Node.js core modules in the browser
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
    buffer: require.resolve('buffer'),
    vm: require.resolve('vm-browserify'),
    fs: false, // fs not available in browser
  };

  // ✅ Alias 'process/browser' if needed
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'process/browser': require.resolve('process/browser.js'),
  };

  // ✅ Provide global polyfills
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  // ✅ Optional: suppress face-api.js source map warnings
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [/node_modules\/face-api\.js/],
  });

  return config;
};
