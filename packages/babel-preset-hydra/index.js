module.exports = {
  plugins: [
    [
      require('babel-plugin-styled-components').default,
      {
        ssr: true,
        minify: true
      }
    ]
  ],
  presets: [
    require('babel-preset-stage-2'),
    require('babel-preset-react'),
    [
      require('babel-preset-env'),
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
}
