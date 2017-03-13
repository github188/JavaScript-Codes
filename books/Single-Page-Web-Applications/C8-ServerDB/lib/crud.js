/**
 * spa 数据库操作文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-13 15:59:34
 * @version $Id$
 */

'use strict';

var 
    MongoClient     = require( 'mongodb' ).MongoClient,
    fsHandle        = require( 'fs' ),
    JSV             = require( 'JSV' ).JSV,

    checkType,  constructObj,   readObj,
    updateObj,  destroyObj,

    loadSchema, checkSchema, clearIsOnline,
    
    dbHandler, collection, objTypeMap, validator
    ;


/* ------- START MongoDB ------------------------------------- */
// MongoDb 服务
MongoClient.connect(
    'mongodb://localhost:27017/spa',
    function ( err, db ) {

        if ( err ) {
            debug( err );
            return false;
        } else {
            debug( ' **** MongoDB connected ! **** ' );
            dbHandler = db;

            // db.close();
        }
    }
);

/* ------- START MongoDB ------------------------------------- */

/* ------- START JSV ------------------------------------- */

objTypeMap = {
    'user'  : {}
};

validator = JSV.createEnvironment();

loadSchema = function ( schema_name, schema_path ) {
    
    fsHandle.readFile( schema_path, 'utf8', function ( err, data ) {
        if ( err ) {
            debug( err );
            return false;
        } else {
            objTypeMap[ schema_name ] = JSON.parse( data );
        }
    } );    
};

checkSchema = function ( obj_type, obj_map, callback ) {
    
    var 
        schema_map = objTypeMap[ obj_type ],
        report_map = validator.validate( obj_map, schema_map );

    callback( report_map.errors );
};

/* ------- END JSV ------------------------------------- */


/* ------- START CRUD ------------------------------------- */
checkType = function ( obj_type ) {
    
    if ( !objTypeMap[ obj_type ] ) {
        return ({
            error_msg: 'Object type "' + obj_type + '" is not supported.'
        });
    }
};

constructObj = function ( obj_type, obj_map, callback ) {
    
    var type_check_map = checkType( obj_type );
    if ( type_check_map ) {
        callback( type_check_map );
        return false;
    }

    checkSchema( obj_type, obj_map, function ( error_list ) {

        if ( error_list.length > 0 ) {
            callback({
                error_msg   : 'Input document not valid',
                error_list  : error_list
            });
        } else {
            collection = dbHandler.collection( obj_type );

            collection.insert( obj_map, function ( err, result ) {
                if ( err ) {
                    console.log( err );
                    return false;
                } else {
                    callback( result );
                }

                // dbHandler.close();
            } );
        }
    });
};

readObj = function ( obj_type, find_map, callback ) {

    var type_check_map = checkType( obj_type );
    if ( type_check_map ) {
        callback( type_check_map );
        return false;
    }

    collection = dbHandler.collection( obj_type );

    collection.find( find_map ).toArray( function ( error, map_list ) {
        if ( !error ) {
            callback( map_list );
        } else {
            debug( err );
            return false;
        }

        // dbHandler.close();
    } );
};

updateObj = function ( obj_type, find_map, set_map, callback ) {
    var type_check_map = checkType( obj_type );
    if ( type_check_map ) {
        callback( type_check_map );
        return false;
    }

    checkSchema( obj_type, find_map, function ( err_list ) {
        if ( err_list.length > 0 ) {
            callback({
                error_msg   : 'Input document not valid',
                error_list  : error_list
            });
        } else {

            collection = dbHandler.collection( obj_type );

            collection.updateOne(
                find_map, 
                { $set: set_map },
                function ( err, result ) {
                    callback( result );

                    // dbHandler.close();
                }
            );
        }
    });
};

destroyObj = function ( obj_type, find_map, isOne, callback ) {

    var type_check_map, collection_callback;

    type_check_map = checkType( obj_type );
    if ( type_check_map ) {
        callback( type_check_map );
        return false;
    }

    collection = dbHandler.collection( obj_type );

    // 要删除多个的时候，使用 deleteMany

    collection_callback = function ( error, result ) {
        callback( result );
    }

    if ( isOne ) {
        collection.deleteOne( find_map, collection_callback );
    } else {
        collection.deleteMany( find_map, collection_callback );
    }

    // collection.deleteOne(
    //     find_map, 
    //     function ( err, result ) {
    //         callback( result );
    //         // dbHandler.close();
    //     }
    // );
};

/* ------- END CRUD ------------------------------------- */


/* ------- START MODULE INIT ------------------------------------- */

(function () {
    // 预加载规则文件
    var schema_name, schema_path;

    for ( schema_name in objTypeMap ) {
        if ( objTypeMap.hasOwnProperty( schema_name ) ) {
            schema_path = __dirname + '/' + schema_name + '.json';

            loadSchema( schema_name, schema_path );
        }
    }
}());

/* ------- END MODULE INIT ------------------------------------- */

function debug( str ) {
    console.log( str );
}

module.exports = {
    makeMongoId     : null,
    checkType       : checkType,
    construct       : constructObj,
    read            : readObj,
    update          : updateObj,
    destroy         : destroyObj
};