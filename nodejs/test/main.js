/**
 * node.js test file
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-09 17:22:47
 * @version $Id$
 */

(function () { /* I'm template */ }());

/******************************  2. 缓冲区 ******************************/

/*
	Buffer 类：专门用来存放二进制数据的类
 */

(function TestBuffer() {

	/*
		创建 buffer 类方法：
			1. 指定长度
			2. 数据数组
			3. 字符串
	 */
	
	var buf, buf2, writeLen, readBuf, result;

	buf 	= new Buffer( 10 );  // <Buffer c0 e8 5f 02 00 00 00 00 48 e9>

	buf 	= new Buffer([ 1, 2, 3, 4, 5 ]); 	// <Buffer 01 02 03 04 05>

	buf 	= new Buffer( 'I am string to create buffer.' );
	// res: <Buffer 49 20 61 6d 20 73 74 72 69 6e 67 20 74 6f 20 63 72 65 61 74 65 20 62 75 66 66 65 72 2e>

	// 指定编码方式
	buf 	= new Buffer( 'I am string to create buffer.', 'utf-8' ); // 结果同上，默认是：utf-8

	// 其他格式："ascii", "utf8", "utf16le", "ucs2", "base64" 和 "hex"


	/*
		IO 函数
			1. 写		：buf.write( string, [offset], [length], [encoding] )
			2. 读		：buf.toString([encoding], [start], [end])
			3. JSON转换	：buf.toJSON()
			4. 合并 	：Buffer.concat( list[, totalLength ]);
			5. 比较 	：buf.compare( other )
			6. 拷贝		：buf.copy( targetBuf, [targetStart], [srcStart], [srcEnd])
			7. 裁剪		：buf.slice([start], [end])
			8. 长度		：buf.length
	 */
	
	buf 	= new Buffer( 6 );

	// 清空
	buf.write( '', 0, 100, 'utf-8' );

	// 1. 写入数据，超出部分不写入，返回写入的数据长
	writeLen 	= buf.write( 'Hello Node.js.' );
	// debug( 'length  : ' + writeLen );

	// 2. 读取
	readBuf 	= buf.toString();
	// debug( 'read buf: ' + readBuf );

	// 3. JSON 转换，转换后的对象模版：{ type: 'Buffer', data: [ .... ] }
	var json 	= buf.toJSON(); 
	// debug( json, 'json' ); // res: { type: 'Buffer', data: [ .... ] }
	
	// 4. 合并，构造器函数
	buf2 		= new Buffer( 7 );
	buf2.write( 'Node.js', 0 );
	result = Buffer.concat( [ buf, buf2 ], 13 );
	// debug( result.toString( 'ascii' ) ); // res: Hello Node.js

	// 5. 比较，这里应该比较的只是长度
	buf2 		= new Buffer( 7 );
	buf2.write( 'Hello ' );
	result 		= buf.compare( buf2 );
	// debug( result );  // 返回：-1，buf < buf2；0，buf == buf2; 1，buf > buf2

	// 6. 拷贝，途径是：将buf2 中的内容拷贝至 buf1 中，无返回值
	buf1 		= new Buffer( 10 );
	buf2 		= new Buffer( 'I am lizc', 'utf-8' );
	// buf2.copy( buf1, 0, 0 );  	// 等价于：buf2.copy( buf1 ); buf1: I am lizc@
	buf2.copy( buf1, 5, 2, 4 ); 	//  res: ¢amP�
	// debug( buf1.toString() );

	// 7. 裁剪，这里返回有点奇怪，返回的值是裁剪后的缓冲区，但是这个缓冲区和原来被裁剪的是
	// 公用一块内存，只是起始索引不同
	buf1 		= new Buffer( 'abcdefghij' );
	buf2 		= buf1.slice( 2, 5 );
	// debug( buf2.toString() ); 	// o: cde
	// 尝试修改 buf2
	buf2.write( '123' );
	// debug( buf2.toString() );	// o: 123
	// debug( buf1.toString() ); 	// o: ab123fghij
	// 因此得出结论，slice 的返回的缓冲区就是原来的内存块，只是修改了指针起始位置而已

	// 8. 长度
	buf1 		= new Buffer( 'abcdefghij' );
	// debug( buf1.length ); 	// 10
	// 尝试修改长度，看看会不会将缓冲区截断
	buf1.length = 3;
	// debug( buf1.toString() ); // 结果并不会，也就是说不像数组那样可以通过长度来截取

}());


/******************************  1. 事件 ******************************/

(function TestEvents() {

	return;

	var EventEmitter 	= require( 'events' ).EventEmitter,
		emitter 		= new EventEmitter();

	emitter.on( 'say', function ( e ) {
		
		debug( 'say: i am listener 1' );
	} );

	emitter.on( 'say', function ( e ) {
		
		debug( 'say: i am listener 2' );
	} );


	delay( 1, function () { emitter.emit( 'say', 'hello events' ); } );

}())


/******************************  0. 通用 ******************************/

function delay( timeout, callback ) {
	setTimeout( function () {
		callback();
	}, timeout * 1000 );
}

function debug( str, split ) {

	if ( split ) {
		console.log( '----------------> ' + split );
		console.log( str );
		console.log( '<---------------- ' + split );
		return;
	}

	console.log( str );
}
