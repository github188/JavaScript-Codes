
var MongoClient = require( 'mongodb' ).MongoClient,
	tool 		= require( 'util').format,
	fs 			= require( 'fs' ),

	db, collection, c, url, ca, cert;

// // 单实例
// url = 'mongodb://localhost:27017/test';

/*
	多实例

	不同服务直接用逗号隔开，并且必须要指定副本集名称
	如：replicaset=rsname
 */
// url = 'mongodb://localhost:27017,localhost:27018/test?replicaset=rs0';

// 读取认证证书，前提在项目目录下必须准备好 ssl/ca.pem 和 ssl/clientpem 整数文件
ca 		= [ fs.readFileSync( __dirname + '/ssl/ca.pem' ) ];
cert 	= fs.readFileSync( __dirname + '/ssl/client.pem' );


url = 'mongodb://dave:password@localhost:27017'
	+ '?authMechanism=DEFAULT'
	+ '&authSource=db'
	+ '&ssl=true';

MongoClient.connect( url,
	server: {
		sslValidate	: true,
		sslCA 		: ca,
		sslCert 	: cert
	},
	function ( err, dbHandler ) {

		if ( err ) {
			console.log( err );
			return false;
		} else {
			console.log( ' Connected to mongodb !' );

			db = dbHandler;

			collection = db.collection( 'user' );

			c = collection;

			// start();

			// db.close();
		}
	}
);


// 插入：{a:1}, {b:2}, {c:3}, {d:4}


var out_result = function ( result ) {
	
	debug( ' ----------- found !' );
	// debug( result );

	db.close();
};


var test = {};

test.insert = function ( datas ) {

	// 插入之前先查找下是否存在，存在就不用重复插入了

	c.find( datas, function ( err, result ) {
		out_result( result );
	});

	// c.insertMany( 
	// 	datas, 
	// 	function ( err, result ) {

	// 		debug( 'insert successed !' );
	// 		// debug( result );	

	// 		db.close();
	// 	} 
	// );
};

test.find = function ( datas ) {
	
	datas = datas || {};

	// c.find( datas, function ( err, result ) {
	// 	out_result( result );
	// } );

	c.find( datas ).toArray( function ( err, result ) {
		out_result( result );
	})

}

function start() {
	
	// 插入
	test.insert( [ { a: 1 }, { b: 2 }, { c: 3 }, { d: 4 } ] );

	// test.find();
}


function debug( str ) {
	console.log( str );
}
