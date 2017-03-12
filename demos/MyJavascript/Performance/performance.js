/**
 *  Javascript性能优化
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-11-18 08:54:38
 * @version $Id$
 */


/**************************************************
 * 1. DOM 操作
 *
 * 尽量避免重绘，统一修改后再添加到DOM树
 */

/*** 1.1 操作 DOM ***/

/* A. 文档片段方式 */
function fragment() {
	var p, t, frag;

	// 1. 创建片段
	frag = document.createDocumentFragment();

	// 2. 创建需要的节点并添加到片段上
	p = document.createElement( 'p' );
	t = document.createTextNode( 'first paragraph' );
	p.appendChild( t );
	frag.appendChild( p );

	p = document.createElement( 'p' );
	t = document.createTextNode( 'second paragraph' );
	p.appendChild( t );
	frag.appendChild( p );
	
	// 3. 将片段添加到 DOM 树中
	document.body.appendChild( frag );
}

/* 
	B. 克隆节点方式，克隆子树的根节点，
	然后对子树修改，完成后将克隆的根节点替换DOM树中原来的根节点 
*/
function clone() {
	var oldNode = document.getElementById( 'result' ),
		clone = oldNode.cloneNode( true );

	// 1. 处理克隆对象


	// 2. 将处理后的克隆对象替换原来的根节点
	oldNode.parentNode.replaceChild( clone, oldNdoe );
}

