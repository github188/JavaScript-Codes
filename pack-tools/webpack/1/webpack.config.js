

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    // entry: './app/index.js',

    entry: {
        main: './app/index.js',
        // vendor: 'moment',
        // hello: './app/hello.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
        // filename: 'bundle.js'
    },

    module: {
        rules: [

            {
                test: /\.jsx?$/,

                include: [
                    path.resolve(__dirname, 'app/index.js')
                ],

                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],

                loader: 'babel-loader',

                // options: {
                //     presets: ["es2015"]
                // }
            }, {
                test: /\.css$/,

                // loader: 'css-loader'
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]

        /*
            1. loader 也可以用 use 代替
         */
    },

    // 插件
    plugins: [

        // 样式打包插件
        new ExtractTextPlugin('style.css'),

        new webpack.optimize.CommonsChunkPlugin({
            // 指定需要单独打包的入口名称（与 entry 配置中的 key 对应）
            // name: [ 'vendor', 'hello' ]
            name: ['vendor', 'manifest'],

            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),

        // 可以重新 new ，也可以在 name: 'vendor' 的地方修改
        // name: ['vendor', 'manifest']
        new webpack.optimize.CommonsChunkPlugin({ 
            name: 'manifest' 
        }),
    ]
};