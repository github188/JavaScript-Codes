
import Sizzle from './sizzle.js';

var sizzleInit = function ( jQuery ) {
	jQuery.find = Sizzle;
};

export default sizzleInit;