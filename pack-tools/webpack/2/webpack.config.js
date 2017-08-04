
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var env = process.env.NODE_ENV;

module.exports = {

    // 1. single entry
    // entry: './src/main.js',
    // 上面单个文件是下面写法的简写
    entry: {
        main: './src/main.js'
    },
    // 2. 多个入口，通过 [name].js 输出多个文件
    // entry: {
    //     app: './src/app.js',
    //     vendor: './src/vendor.js'
    // },

    /*
      输出文件
      1. 固定名称，如：bundle.js
      2. 使用入口文件的名称，如：[name].js，这里的[name]指向的就是entry里面的入口文件名
      3. 多个入口时，使用[name].js来输出多个对应的文件
      4. 加上hash值标识唯一文件：[name]_[hash].js
      5. 给hash值加上截取个数：[name]_[hash:5].js
    */
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[hash:5].js'
    },

    /*
      inline-source-map
      开发环境中使用，可以将错误定位到打包前的文件
      比如错误发生在print.js中，
      如果不加这个控制台错误只会到打包后的文件，
      如果有这个选项，那错误会精确定位到 print.js
    */
    devtool: 'inline-source-map',

    // webpack 服务监听dist目录变化，自动刷新浏览器
    // 热替换文档：https://doc.webpack-china.org/guides/hot-module-replacement/
    devServer: {
        contentBase: './dist'
    },
    module: {

        rules: [
            /*
              注意点：webpack 2.0 中使用loader方式，不能使用 use: 'style!css'

              如果需要添加选项，那么不能使用字符串，要用到对象方式，如下的 css-loader

              loader 几种使用方式：
              1. use: 'css-loader'
              2. use: ['style-loader', 'css-loader']
              3. use: ['style-loader', { loader: 'css-loader' options: { ... }}]

              loader 几种使用地方
              1. 如此处配置文件方式
              2. import时候，如：
              import styles from 'style-loader!css-loader?modules!./style.css';
              3. 命令行
              webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
            */
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                css: ExtractTextPlugin.extract({
                                    fallback: 'css-loader',
                                    use: 'vue-style-loader'
                                })
                            }
                        }
                    }
                ]
            },
            { // css loader
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true, // 为true会将类名打包成hash值
                            importLoaders: 1 // 前面有几个loader 值就是多少
                        }
                    },
                    {
                        // 使用postcss时候必须要有选项，并且选项中必须有内容
                        // 否则会报错：No Postcss config found.
                        // 具体配置和选项参考：https://github.com/michael-ciniawsky/postcss-load-config
                        loader: 'postcss-loader',
                        // 配置也可以通过 postcss.config.js 指定
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            },
            { // file loader
                test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000000
                        }
                    }
                ]
            },
            { // babel loader
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        // 打包后去掉注释
                        comments: false
                    }
                }
            },
            { // json(node 默认自带) csv, tvs文件
                test: /\.(csv|tvs)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },

    plugins: [
        // 1. 丑化js，忽略警告
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),

        // 2. 提取公共部分，适用于多页应用
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common',
        //     chunks: ["app", "vendor"]
        // }),

        // 3. 打包html文件
        new HtmlWebpackPlugin({
            title: 'This is a title generated by HtmlWebpackPlugin',
            filename: 'index.html',
            template: 'index.html',
            // true | body to bottom, head to <head>, false
            inject: 'body',
            // page's icon
            favicon: './assets/nice.png',
            // compress html code
            minify: {},
            // true | false 在文件名后面追加hash值，唯一标识符
            hash: true
        }),

        // 4. 清理数组中指定目录
        new CleanWebpackPlugin(['dist']),

        // 5. 内容没发生变化不需要重新打包，特别适用于将第三方库或者不太会变更的代码提取到公共部分
        new webpack.HashedModuleIdsPlugin(),

        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ]
};
