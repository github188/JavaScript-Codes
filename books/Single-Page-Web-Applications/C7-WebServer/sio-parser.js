/**
 * 测试文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-03 09:54:54
 * @version $Id$
 */


/*
	1. socket.io-parser 解码编码
 */


var parser 		= require( 'socket.io-parser' ),
	// 获取到编码器
	encoder 	= new parser.Encoder(),
	packet 		= {
		type 	: parser.BINARY_EVENT,
		data 	: 'test-packet',
		id 		: 13,
	};

encoder.encode( packet, function ( encodedPackets ) {

	// 获取解码器
	var decoder = new parser.Decoder();

	// 绑定已解码消息
	decoder.on( 'decoded', function ( decodedPacket ) {
		decodedPacket.type 	= parser.BINARY_EVENT;
		decodedPacket.data 	= 'test-packet';
		decodedPacket.id 	= 13;

		console.log( decodedPacket ); // { type: 2, nsp: '/', id: 13, data: 'test-packet' }
	} );

	// 将已编码的数据添加到解码器
	for ( var i = 0, len = encodedPackets.length; i < len; i++ ) {
		decoder.add( encodedPackets[ i ] );
	}

	console.log( 'len = ' + len );

	// 编码输出
	console.log( encodedPackets ); 	// [ '213"test-packet"' ]

} );
