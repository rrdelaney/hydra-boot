const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const { EnvironmentPlugin } = webpack
const { UglifyJsPlugin } = webpack.optimize

module.exports = {
  entry: path.join(process.cwd(), 'src', 'client.js'),
  output: {
    filename: path.join('static', '[name].[hash].js'),
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
    new EnvironmentPlugin({ NODE_ENV: 'production', APP_ENV: 'browser' }),
    new UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: { screw_ie8: true, keep_fnames: true },
      compress: { screw_ie8: true },
      comments: false
    }),
    new ManifestPlugin({ fileName: 'stats.json' })
  ]
}
