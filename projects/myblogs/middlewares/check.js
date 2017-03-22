/**
 * 权限控制文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 16:23:11
 * @version $Id$
 */


module.exports = {
    checkLogin: function ( res, req, next ) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/signin');
        }

        next();
    },

    checkNotLogin: function (res, req, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('back');
        }

        next();
    }
};
