
var percent = 0;
var hasEnd = false;
function step() {
	hasEnd ? percent-- : percent++;
	$('progress').style.width = percent * 3 + 'px';
	if (percent === 100) {
		hasEnd = true;
	} else if ( percent === 0) {
		hasEnd = false;
	}

	requestAnimationFrame(step);
}

	console.log($('progress'));

function $(id) {
	return document.getElementById(id);
}

requestAnimationFrame(step);