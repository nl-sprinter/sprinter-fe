module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /react-minimal-pie-chart/
      }
    ]
  }
}; 