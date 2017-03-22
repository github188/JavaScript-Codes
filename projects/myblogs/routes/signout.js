/**
 * 登出路由
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 16:43:18
 * @version $Id$
 */


var router = require('express').Router(),
    
    checkLogin = require('../middlewares/check').checkLogin
    ;

    
// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;