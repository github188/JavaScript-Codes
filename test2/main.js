
// main.js


( function ( window ) {

    var gcl;



    gcl = function () {
        return new gcl.fn.init();
    }


    // 原型及原型别名
    gcl.fn = gcl.prototype = {
        init: function () {
            return this;
        }
    };





    window.gcl = gcl;
}( window ) );