var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
  entry : './app/index.js',
  output : {
    path : path.resolve(__dirname , 'build'),
    filename: 'index_bundle.js'
  },
  module : {
    rules : [
      {test: /\.(js)$/, use: 'babel-loader'},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.(png|svg|jpg|gif)$/, use: ['file-loader']}
    ]
  },
  mode:'development',
  plugins : [
    new HtmlWebpackPlugin ({
      template : 'public/index.html'
    })
  ]
}
