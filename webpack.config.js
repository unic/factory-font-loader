const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    'factory-font-loader': './src/index.js',
    tests: './src/index.spec.js',
  },
  output: {
    library: 'factory-font-loader',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
};

module.exports = config;
