

var polygon     = require('./regular-polygon'),


    canvas = document.getElementById('reg-polygon'),

    canvasWidth = -1
    ;

canvas.width = 300;
canvas.height = canvas.width;

canvasWidth = canvas.width;

var regPolygon = polygon(canvas);

var result = null;

// canvas.onclick = function (e) {
    
//     regPolygon.pause();
// }



regPolygon
    .origin()
    .r(60)
    .sides(3)
    .styles({
        // "isStroke": true,
        // "strokeStyle": "red",
        "fillStyle": "red"
        // "lineWidth": 3
    }).draw()
    .rotate(Math.PI / 6).draw()
    .rotate(Math.PI / 3).draw()
    .rotate(Math.PI / 2).draw()

