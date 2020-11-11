const {merge} = require('webpack-merge');

const commonConfig = require('./webpack.common.js');

const ENV = 'development';

module.exports = merge(commonConfig({env: ENV}), {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        hot: true,
        injectHot: true,
        watchContentBase: true
    },
});
