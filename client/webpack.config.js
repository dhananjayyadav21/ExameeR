const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/index.html',        
      favicon: '/favicon.ico'     
    }),
  ],
  module: {
    rules: [
     
    ],
  },
};
