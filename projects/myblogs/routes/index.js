/**
 * 入口路由
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 15:29:52
 * @version $Id$
 */


module.exports = function (app) {
    
    app.get('/', function (req, res) {
        res.redirect('/posts');
    });

    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));

};