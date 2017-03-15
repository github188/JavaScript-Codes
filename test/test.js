


function test( msg, callback ) {

    callback( msg );
}

var res = {

    req: 'i am req'
};

res.send = function (  result ) {
    console.log( result + this.req );

    console.log( this );
};

// test( 'hello, ', res.send );

test( 'hello, ', function ( result ) { res.send( result ); } );

// function ( result ) { res.send( result ); }