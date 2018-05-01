const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
      }
    ]
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
};
