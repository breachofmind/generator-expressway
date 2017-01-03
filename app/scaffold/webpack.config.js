"use strict";

var path = require('path');
var webpack = require('webpack');
var app = require('./index');
var paths = app.get('paths');
var config = app.get('config');
var url = app.get('url');

const BUILD_PATH = paths.public();

module.exports = {
    entry: {
        main: [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client',
            paths.resources('js/main.js'),
        ]
    },
    output: {
        path: BUILD_PATH,
        publicPath: url.get(),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                query: {
                    cacheDirectory:true,
                    presets: ['es2015']
                }
            },
            { test: /\.scss$/, loaders: ['style-loader','css-loader','postcss-loader','sass-loader'] },
            { test: /\.css$/,  loaders: ['style-loader', 'css-loader'] },
            { test: /\.vue$/,  loaders: ['vue-loader'] },
        ]
    },
    sassLoader: {
        outputStyle: 'compact',
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
};