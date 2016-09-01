var path = require('path');
var webpack = require('webpack');

console.log(__dirname);

module.exports = {
  entry: [
    'babel-polyfill',
    './src/Gravity',
  ],
  output: {
    publicPath: '/',
    filename: 'gravity.js',
  },
  devtool: 'source-map',
  resolve: {
    root: [
      path.resolve('./src'),
      path.resolve(),
    ]
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        include: [
          path.resolve(__dirname, "src"),
        ],

        test: /\.jsx?$/,

        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  debug: true,
};
