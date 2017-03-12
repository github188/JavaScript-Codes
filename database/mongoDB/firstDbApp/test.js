
var MongoClient = require( 'mongodb' ).MongoClient,
	tool 		= require( 'util').format,
	fs 			= require( 'fs' ),

	db, collection, c, url, ca, cert, isFound = false;




////////////////// START Collations 排序测试 ////////////////////

url = 'mongodb://localhost:27017/test';

MongoClient.connect( url,
	function ( err, dbHandler ) {
		 console.log( '**** Connected to mongodb test ****' ); 

		 db = dbHandler;

		 c = db.collection( 'family' );

		 // 创建规则
		 createCollated( dbHandler, function () {
		 	// dbHandler.close();

		 	debug( '**** collation created ****' );
		 } );

		 // insert
		 testInsert( db, cb );
	}
);

// 创建排序规则
var createCollated = function ( db, callback ) {

	if ( !db ) { return false; }

	// 创建集合的时候指定规则
	db.createCollection(
		'family',
		{
			'collation': {
				'locale' 	: 'zh' // 指定中文排序
			}
		},
		function ( err, result ) {
			// 成功创建后回调

			debug( '**** collection created ****' );

			callback && callback();
		}
	);
};

function testInsert( db, callback ) {
	
	var queryDatas = null, bakDatas;

	queryDatas = [
		{ 'name': '打打工', 'age': 30, 'height': '169cm' },
		{ 'name': '够大好', 'age': 25, 'height': '169cm' },
		{ 'name': '看了看', 'age': 1, 'height': '80cm' },
		{ 'name': '哦i哦', 'age': 52, 'height': '169cm' },
		{ 'name': '葡萄酒', 'age': 51, 'height': '169cm' },
		{ 'name': '阿萨德', 'age': 33, 'height': '169cm' },
		{ 'name': '第三张', 'age': 32, 'height': '169cm' }
	];

	c.insertMany( 
		queryDatas,
		callback
	);
}

function testFindOne( data ) {

	c.find( data, function ( err, result ) {
		if ( err ) {
			isFound = false;
		} else {
			isFound = true;
		}
	});
}

function cb( err, result ) {
	debug( '**** callback called ****' );

	var output = db
		.collection( 'family' )
		.find({}, { 'collation': { 'locale': 'zh' } })
		.toArray( function ( err, result ) { 
			debug( '**** find output ****' ); 

			debug( result, 'cb result' );

			db.close();
		} );

}



////////////////// START 连接 和 认证测试 ////////////////////

// // 单实例
// url = 'mongodb://localhost:27017/test';

/*
	多实例

	不同服务直接用逗号隔开，并且必须要指定副本集名称
	如：replicaset=rsname
 */
// url = 'mongodb://localhost:27017,localhost:27018/test?replicaset=rs0';

// 读取认证证书，前提在项目目录下必须准备好 ssl/ca.pem 和 ssl/clientpem 整数文件
// ca 		= [ fs.readFileSync( __dirname + '/ssl/ca.pem' ) ];
// cert 	= fs.readFileSync( __dirname + '/ssl/client.pem' );


// url = 'mongodb://dave:password@localhost:27017'
// 	+ '?authMechanism=DEFAULT'
// 	+ '&authSource=db'
// 	+ '&ssl=true';

// MongoClient.connect( url,
// 	server: {
// 		sslValidate	: true,
// 		sslCA 		: ca,
// 		sslCert 	: cert
// 	},
// 	function ( err, dbHandler ) {

// 		if ( err ) {
// 			console.log( err );
// 			return false;
// 		} else {
// 			console.log( ' Connected to mongodb !' );

// 			db = dbHandler;

// 			collection = db.collection( 'user' );

// 			c = collection;
// 		}
// 	}
// );


// 插入：{a:1}, {b:2}, {c:3}, {d:4}
/*

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
*/

function debug( str, split ) {

	if ( split ) {
		console.log( '----------------> ' + split );
		console.log( str );
		console.log( '<---------------- ' + split );
		return;
	}

	console.log( str );
}
