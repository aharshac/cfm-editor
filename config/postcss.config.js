const path = require('path');

// npm i -D normalize.css stylelint postcss-import postcss-cssnext postcss-flexbugs-fixes postcss-browser-reporter stylelint stylelint-config-css-modules serve
module.exports = () => [
  require('stylelint')({
    configFile: path.resolve(__dirname, './stylelint.config.js')
  }),
  require('postcss-import')(),
  require('postcss-cssnext')({
    autoprefixer: {
      flexbox: 'no-2009',
    },
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ],
    features: {
      customProperties: {
        variables: {
          fontSize: '16pt',
          fontSizeXLarge: '13pt',
          fontSizeLarge: '11pt',
          fontSizeMedium: '11pt',
        },
      },
      customMedia: {
        extensions: {
          '--xlarge': '(max-width: 1680px)',
          '--large': '(max-width: 1280px)',
          '--medium': '(max-width: 1024px)',
          '--small': '(max-width: 767px)',
          '--xsmall': '(max-width: 480px)',
        }
      }
    },
  }),
  require('postcss-flexbugs-fixes')(),
  require('postcss-browser-reporter')({
    clearMessages: true,
    plugins: ['!postcss-discard-empty']
  })
];
