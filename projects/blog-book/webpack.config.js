
const path = require('path');

module.exports = {

    entry: () => [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://192.168.179.103:8080',
        path.resolve(__dirname, 'index.js')
    ],

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },

    module: {   
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            }
        ]
    }
};