"use strict";

var path = require('path');
var webpack = require('webpack');
var app = require('./index');

// App services
var [paths,config,url] = app.get('paths','config','url');

module.exports = {
    entry: {
        main: [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client',
            paths.resources('js/main.js'),
        ]
    },
    output: {
        path: paths.public(),
        publicPath: url.get(),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devtool: 'source-map',
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