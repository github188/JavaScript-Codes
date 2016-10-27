var init = function(jQuery){
    jQuery.fn.init = function (selector, context, root) {
        if (!selector) {
            return this;
        } else {
            // var elem = document.querySelector(selector);
            var elemList = jQuery.find( selector );
            if ( elemList.length ) {
                // this[0] = elem;
                // this.length = 1;
                jQuery.merge( this, elemList );
            }
            
            return this;
        }
    };

    jQuery.fn.init.prototype = jQuery.fn;
};



export default init;