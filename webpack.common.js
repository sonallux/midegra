const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (options) => ({
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: options.env === 'production' ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
        chunkFilename: options.env === 'production' ? '[name].[contenthash].chunk.js' : '[name].chunk.js'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            base: '/',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm', to: 'graphvizlib.wasm' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: options.env === 'production' ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: options.env === 'production' ? '[id].[contenthash].css' : '[id].css'
        }),
    ]
});
