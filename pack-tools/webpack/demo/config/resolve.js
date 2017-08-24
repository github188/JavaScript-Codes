/**
 * resolve.js
 */
var path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    alias: {
        assets: path.resolve(__dirname, 'assets/'),
        src: path.resolve(__dirname, 'src/'),
        components: path.resolve(__dirname, 'src/components/'),
        tools: path.resolve(__dirname, 'src/tools'),
        config: path.resolve(__dirname, 'src/config')
    },

    extensions: ['.js', '.jsx', '.styl', '.stylus', '.less', '.scss', '.vue']
};
