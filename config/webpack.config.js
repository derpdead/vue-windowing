const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: path.resolve(`${__dirname}./../src/index.js`),
  output: {
    path: path.resolve(`${__dirname}./../dist`),
    filename: 'vue-windowing.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('src'),
    },
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
    },
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.css$/,
      use: [
        'vue-style-loader',
        'css-loader',
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
