var path = require('path');
console.log('Node Environment: ', process.env.NODE_ENV);

function tsLoaderRule() {
  console.log('Configuring ts-loader rule');
  
  return  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  };
}

module.exports = {
  mode: 'development',
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js'
  },
  module: {
      rules: [
        tsLoaderRule()         
      ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};