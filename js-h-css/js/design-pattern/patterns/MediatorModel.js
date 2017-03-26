/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-11-16 07:58:44
 * @version $Id$
 */

/**
 * 中介者模式
 * 
 * 作为中介者介入到对象之间，对象相互直接的关系和行为，从而使对象与对象之间
 * 松耦合
 */

/********************** 示例 **********************/

/**
 * 按键计分游戏
 *
 * 对象：
 * 	1. Player 1
 * 	2. Player 2
 * 	3. ScoreBoard
 * 	4. Mediator
 */

function Player( name ) {
	this.points = 0; // score
	this.name = name; 
}

Player.prototype.play = function () {
	this.points += 1;
	mediator.played(); // 玩家玩的动作由中介者完成
};

var scoreboard = {

	// 待更新的计分板元素
	element: document.getElementById( 'results' ),

	// 更新分数
	update: function ( score ) {

		var i, msg = '';
		for ( i in score ) {
			if ( score.hasOwnProperty( i ) ) {
				msg += '<p><strong>' + i + '<\/strong>: ';
				msg += score[ i ];
				msg += '<\/p>';
			}
		}
		this.element.innerHTML = msg;
	}
};

var mediator = {

	// all players
	players: {},

	// init
	setup: function () {

		var players = this.players;
		players.home = new Player( 'Home' );
		players.guest = new Player( 'Guest' );

	},

	// 有人玩，更新分数
	played: function () {

		var players = this.players,
			score = {
				Home: players.home.points,
				Guest:players.guest.points
			};

		scoreboard.update( score );
	},

	// 交互
	keypress: function ( e ) {

		e = e || window.event; // IE
		if ( e.which === 49 ) { // key 1
			mediator.players.home.play();
			return;
		}

		if ( e.which === 48 ) {
			mediator.players.guest.play(); // key 0
			return;	
		}
	}
};

// run
mediator.setup();
window.onkeypress = mediator.keypress;

// game over after 30s
setTimeout( function () {
	window.onkeypress = null;
	alert( 'Game Over !' );
}, 30000 );