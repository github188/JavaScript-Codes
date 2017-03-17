

var dosth = new Promise( (resolve, reject) => {
    resolve( x + 2 );
} );

dosth
    .then( result => console.log( result ), error => console.log( error ) )
    // .catch( error => console.log( error ) )