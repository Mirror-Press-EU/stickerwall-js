const autoprefixer = require('autoprefixer');

var config = {
  entry: ['./app.scss', './app.js'],
  output: { filename: 'bundle.js' },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          }, {
            loader: 'extract-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer()
                ]
              }
            } 
          }, {
            loader: 'sass-loader',
            options: {
              // See https://material.io/develop/web/getting-started
              sassOptions: {
                includePaths: ['./node_modules']
              },

              implementation: require('sass'),

              webpackImporter: false,
            },
          }
        ]
      }, {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //...
  }

  return config;
}