
function Debuger(id) {
    
    this.no = 1;
    this.div = null;
    this.id = id || 'gcl-test-div';
    this.switch = false;
    this.created = false;
    this.style = {
        position: 'absolute',
        left: '0px',
        top: '0px',
        backgroundColor: 'gray',
        height: '100%',
        width: '200px',
        fontSize: '16px',
        textAlign: 'left'
    };
    this.split = '';

    this.setSplit = function (split) {
        this.split = split;
    }

    this.create = function () {
        var info = document.createElement('div');
        info.id = this.id;

        for (var prop in this.style) {
            info.style[prop] = this.style[prop];
        }
        
        document.body.appendChild(info);

        this.div = info;

        this.created = true;
        return this;
    };

    this._print = function (str) {
        this.div.innerHTML += '[' + (this.split ? this.split : this.no++) + ']' + str + '<br>';
    };

    this.print = function (obj, desc, isValue) {
        
        if (!this.switch) { return false; }

        var content = '';

        if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {

                content = isValue 
                    ? obj[i].key 
                    : obj[i].key 
                        ? obj[i].desc + ': yes' 
                        : obj[i].desc + ': no';

                this._print(content);
            }
        } else {
            this._print(
                isValue
                    ? desc + ':' + JSON.stringify(obj)
                    : obj 
                        ? desc + ': yes' 
                        : desc + ': no'
            );
        }
    };

    this.open = this.start = this.on = function () {
        
        if (!this.created) {
            this.create();
        }

        this.switch = true;
    };

    this.close = this.off = function () {

        this.switch = false;
        this.div.innerHTML = '';
        // document.body.removeChild(this.div);
    }
}



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