/**
 * /posts 下路由处理文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 16:30:12
 * @version $Id$
 */


var router = require('express').Router(),
    
    checkLogin  = require('../middlewares/check').checkLogin;
    ;



// eg: GET /posts?author=...
router.get('/', function (req, res, next) {
    res.send(req.flash());
});

// 发表文章
router.post('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

// 发表文章页， GET /posts/create
router.get('/create', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId 单独文章页
router.get('/:postId', function (req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', function (req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', function (req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', function (req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', function (req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;