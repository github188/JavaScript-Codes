/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-12-08 14:57:48
 * @version $Id$
 *
 *
 * 2016/12/8 14:58:20
 * [ADD] ccCreateElement
 *
 * 2016/12/9 10:26:40
 * [ADD] ccGetEleFirstTextNode
 *
 * 修改前缀：-> cc
 */


/**
* 创建DOM元素，另附加设置样式（行内）
* @param  {Object} styles 将要创建的元素的样式对象
* @return {[type]}        [description]
*
* Warning: 
*     该对象中成员名必须要和样式中关键字一致，否则会出错
*/
function ccCreateElement( nodeName, style ) {
   
   if ( typeof nodeName !== 'string' ) {
       return null;
   }

   var prop = '',
       ele = null,
       doc = document;

   ele = doc.createElement( nodeName );

   // 表示没有样式，直接返回元素
   if ( !isObject( style ) ) {
   	return ele;
   }

   for ( prop in style ) {

       if ( style.hasOwnProperty( prop ) ) {

           if ( typeof ele.style[ prop ] !== 'undefined' && style[ prop ] !== '' ) {

               ele.style[ prop ] = style[ prop ];
           }

           // 实例中存在属性，且该属性对应在元素 style 中存在，切将要设置的属性值不为空
       }
   }

   return ele;
}

/**
 * 获取元素子元素的第一个文本节点
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
function ccGetEleFirstTextNode( parent ) {
   
   if ( !parent ) {
       return null;
   }

   var childs = parent.childNodes,
       i = 0,
       len = childs.length;

   for ( ; i < len; i++ ) {

       // 只要第一个
       if ( isTextNode( childs[ i ] ) ) {

           return childs[ i ];
       }
   }

   // not found
   return null;
}





 ////////////////////////////////////////////////////////////////
 ///

function $( id ) {
   return document.getElementById( id );
}

function isArray( arr ) {
   
   return Object.prototype.toString.call( arr ) === '[object Array]';
}

function isObject( obj ) {
   
   return Object.prototype.toString.call( obj ) === '[object Object]';
}

function isTextNode( node ) {
   
   return Object.prototype.toString.call( node ) === '[object Text]'; 
}
