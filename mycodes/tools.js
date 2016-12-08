


/**
 * 批量生产对象，然后转成JSON输出到控制台，供测试用
 * @param  {[type]} n        [description]
 * @param  {[type]} template [description]
 * @return {[type]}          [description]
 */
function generateObj(n, template) {

    var obj = [],
    	i = 0,
    	t = '',
    	prop = null;

    for (var i = 0; i < n; i++) {

        obj[i] = {};

        for ( prop in template ) {

            var t = '';

            if (i >= 0 && i < 10) {

                t = '00' + i;
            } else if (i >= 10 && i < 100) {

                t = '0' + i;
            } else {

                t = '' + i;
            }

            obj[i].no = t;
            obj[i][prop] = template[prop];
        }
    }
    return JSON.stringify(obj);
}