import jQuery from './core';
import global from './global';
import init from './init';
import sizzleInit from './sizzle/init';

global( jQuery );
init( jQuery );
sizzleInit( jQuery );

export default jQuery;