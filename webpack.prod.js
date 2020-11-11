const {merge} = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./webpack.common.js');

const ENV = 'production';

module.exports = merge(commonConfig({env: ENV}), {
    mode: 'production',
    optimization: {
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin()
      ]
    },
    performance: { hints: false }
});
