// https://github.com/gaearon/flux-react-router-example/blob/master/.eslintrc
module.exports = {
  entry: {
    index: './main.js'
  },
  output: {
    path: './',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // exclude: /(node_modules)|(examples)/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      }
    ]
  }
}
