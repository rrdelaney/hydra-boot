const path = require('path')
const webpack = require('webpack')
const { EnvironmentPlugin } = webpack
const BeatifulWebpackPlugin = require('beautiful-webpack')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(process.cwd(), 'src', 'client.js')
  ],
  output: {
    filename: path.join('static', '[name].js'),
    path: path.join(process.cwd(), 'build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(process.cwd(), 'src')],
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'styled-components',
              {
                ssr: true,
                minify: true
              }
            ],
            [
              'lodash',
              {
                id: ['lodash', 'semantic-ui-react']
              }
            ]
          ],
          presets: [
            'stage-2',
            'react',
            [
              'env',
              {
                modules: false
              }
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new EnvironmentPlugin({ APP_ENV: 'browser' }),
    new BeatifulWebpackPlugin('Things', 'http://localhost:3000')
  ]
}
