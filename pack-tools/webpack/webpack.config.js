/**
 * webpack 配置示例文件
 */


var 
    path    = require('path'),

    // 需要进行项目安装 webpack
    webpack = require('webpack');


module.exports = {

    /*
        指定入口文件
     */
    entry: './index.js',

    /*
        指定出口文件
     */
    output: {
        filename: './bundle.js'
    },

    /*
        路径解析
     */
    resolve: {
        // 路径别名
        alias: {

            // __dirname/src/scripts/components 别名
            components: path.join(__dirname, '..', 'src', 'scripts', 'components')
        }        
    },

    /* 
        指定配置文件上下文，比如配置文件在项目根目录下的 config/ 下

        执行命令时候需要加上 `--config config/webpack.config.js`
     */
    context: path.join(__dirname, '..'),


    /*
        加载器：(js 中可以 require 样式文件 `require('styles/main.css');`)

        css: style-loader, css-loader

        install: npm install --save-dev style-loader css-loader
     */
    module: {
        loaders: [
            {  /* css */
                // 指定 .css 后缀的文件
                test: /\.css$/,

                // 排除指定目录 'exclude_dir'
                exclude: path.join(__dirname, 'exclude_dir'),

                // 指定加载器
                loader: 'style!css'
            }, 

            { /* js/jsx */
                test: /\.js|jsx$/,

                exclude: '/node_modules/',

                loader: ['babel?presets[]=es2015,presets[]=env,presets[]=react']
            }

        ]
    },

    /*
        插件
     */
    plugins: [

        // 比如：UglifyJs 压缩插件
        new webpack.optimize.UglifyJsPlugin()
    ],

    /*
        webpack 服务器

        desc: 运行服务器时候会同时执行 webpack 命令打包代码

        name: webpack-dev-server

        install: npm install -g webpack-dev-server

        use: 
            webpack-dev-server --config config/webpack.config.js

        visit: 
            http://localhost:8080/webpack-dev-server/
     */
    devServer: {
        // 指定静态文件目录，指定之后去访问 visit 时候就会显示该目录下的所有文件列表
        contentBase: path.join(__dirname)
    }
}


