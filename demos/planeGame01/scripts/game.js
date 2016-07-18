
// get canvas
var canvas = $("game");

// get canvas context
var ctx = canvas.getContext && canvas.getContext("2d");
if ( !ctx ) {
	alert("Unsupported canvas. Please check and upgrade you browser to newest!");
} else {
	startGame();
}

function startGame() {
	// to start game
	// 矩形一
	ctx.fillStyle = "#FFFF00"; // 填充色
	ctx.fillRect(50, 100, 380, 400); // 绘制矩形

	// 矩形二，半透明添加到矩形一上
	ctx.fillStyle = "rgba(0, 0, 128, 0.5)";
	ctx.fillRect(0, 50, 380, 400);

	// 以创建图像对象 + onload图片加载方式去请求图片
	var img = new Image();
	img.onload = function () {
		 // ctx.drawImage(img, 100, 100); 
		 ctx.drawImage(img, 0, 0, 37, 41, 100, 100, 37, 41);
	}
	img.src ="images/sprites.png";
}



function $( __id ) {
	return document.getElementById(__id);
}