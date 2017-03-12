/**
 * CRUD 操作文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-07 15:40:23
 * @version $Id$
 */



var 
	MongoClient 	= require( 'mongodb' ).MongoClient,

	createObj, readObj, updateObj, deleteObj, getCollection,

	db, collection;

init = function ( host, dbName ) {
	var url = 'mongodb://' + host + ':27017/' + dbName;

	MongoClient.connect( url, function ( err, dbHandler ) {
		db = dbHandler;

		console.log( ' ** Mongo database connected to ' + dbName );

		// db.close();	
	});
};

getCollection = function ( name ) {

	if ( !name ) { return null; }

	collection = db.collection( name );

	return collection;	
};

createObj = function ( collectionName, itemObj, callback ) {

	// 获取分片
	getCollection( collectionName );

	if ( !collection ) { return false; }

	// 这里还可以区分 itemObj 是对象数组，还是对象 [TODO]

	console.log( itemObj );

	collection.insert( itemObj || {}, function ( err, result ) {

		if ( err ) {
			console.log( err );
			return false;
		} else {

			result = result || 'nothing created.';
			callback( result );
		}

		db.close();
	});
};

readObj = function ( collectionName, itemObj, callback ) {

	// 获取分片
	getCollection( collectionName );
	if ( !collection ) { return false; }

	collection.find( itemObj || {} ).toArray( function ( err, result ) {
		if ( err ) {
			console.log( err );
			return false;
		} else {

			result = result || 'nothing found.';

			callback( result );
		}

		db.close();
	} );
};

updateObj = function ( collectionName, itemObj, callback ) {
	
	// 获取分片
	getCollection( collectionName );
	if ( !collection ) { return false; }

	collection.updateOne( 
		itemObj.find_map, 
		{ $set: itemObj.update_map }, 
		function ( err, result ) {

			if ( err ) {
				console.log( err );
				return false;
			} else {

				result = result || 'nothing to update.';

				callback( result );
			}

			db.close();
		}				
	);
};

deleteObj = function ( collectionName, itemObj, callback ) {
	
	// 获取分片
	getCollection( collectionName );
	if ( !collection ) { return false; }

	collection.deleteOne( itemObj, function ( err, result ) {

		if ( err ) {
			console.log( err );
			return false;
		} else {

			result = result || 'nothing to delete.';

			callback( result );
		}

		db.close();
	});
};

function debug( str ) {
	console.log( str );
}

module.exports = {
	init 		: init,
	createItem 	: createObj,
	read 		: readObj,
	update 		: updateObj,
	deleteItem 	: deleteObj
};
