/*
	rollover.js 图片切换
 */


window.onload = function () {
		
	rollover();
};


function rollover() {
	
	var i, len, imgs, img, overImg, outImg;

	imgs 	= document.images;
	len 	= imgs.length;

	for ( i = 0; i < len; i++ ) {

		img = imgs[ i ];
		overImg = img.getAttribute( 'data-rollover' );
		if ( !overImg ) { continue; }

		( new Image() ).src = overImg;

		img.setAttribute( 'data-rollout', img.src );

		img.onmouseover = function ( event ) {
			this.src = this.getAttribute( 'data-rollover' );	
		};

		img.onmouseout = function ( event ) {
			this.src = this.getAttribute( 'data-rollout' );	
		};
	}
}