/**
 * 用户路由
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 15:31:40
 * @version $Id$
 */

var router = require('express').Router();

router.get('/:name', function (req, res) {
    res.render(
        'users',
        {
            name: req.params.name
        }
    );
});


module.exports = router;