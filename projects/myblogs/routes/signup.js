/**
 * 注册路由
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 16:43:18
 * @version $Id$
 */


var router = require('express').Router(),
    
    checkNotLogin = require('../middlewares/check').checkNotLogin
    ;


// GET /signup 注册页面
router.get('/', checkNotLogin, function (req, res, next) {
    res.send(req.flash());
});

// POST /signup 注册
router.post('/', checkNotLogin, function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;