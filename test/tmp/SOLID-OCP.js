


/**
 * S.O.L.I.D五大原则之开闭原则OCP
 * 
 * OCP: The Open/Closed Principle 
 *
 * 在不修改原对象的基础上完成功能的修改，通过扩展完成
 */

/*
// 实例代码，没遵循OCP原则


// 问题列表类型
var AnswerType = {
	Choice: 0,
	Input: 1
};


// 问题实体
function question(label, answerType, choices) {
	return {
		label: label,
		answerType: answerType,
		choices: choices
	};
}

var view = (function () {
	function renderQuestion( target, question ) {

		// 问题列表容器
		var questionWrapper 		= document.createElement('div');
		questionWrapper.className 	= 'question';

		// 问题列表标签说明
		var questionLabel 			= document.createElement('div');
		questionLabel.className 	= 'question-label';

		var label 	= document.createTextNode( question.label );
		questionLabel.appendChild( label );

		var answer 			= document.createElement('div');
		answer.className 	= 'question-input'; 

		// 根据不同类型创建问题列表
		if ( question.answerType === AnswerType.Choice ) {
			var input 	= document.createElement('select'),
				len 	= question.choices.length;

			for ( var i = 0; i < len; i++ ) {
				var option 		= document.createElement('option');
				option.text 	= question.choices[i];
				option.value 	= question.choices[i];

				input.appendChild( option );
			}
		} else if ( question.answerType === AnswerType.Input ) {
			var input 	= document.createElement('input');
			input.type 	= 'text';
		}

		answer.appendChild( input );
		questionWrapper.appendChild( questionLabel );
		questionWrapper.appendChild( answer );
		target.appendChild( questionWrapper );
	}

	return {
		render: function ( target, questions ) {
			for ( var i = 0, len = questions.length; i < len; i++ ) {
				renderQuestion( target, questions[i] );
			}
		}
	};
} ());

var questions = [
					question( "11111", AnswerType.Choice, ['Yes', 'No'] ),
					question( '2222', AnswerType.Input )
				];

var questionRegion = document.getElementById('question');
view.render( questionRegion, questions );
*/

/***************** 重构之后代码 *****************/

/**
 * 1. 添加不同类型的问题列表
 * 2. 在不修改原来代码的基础上，通过扩展方式去处理
 *
 * 那就需要考虑以下问题：
 * 1. 把具体功能拎出来，作为一个功能或者对象去添加，比如：下拉列表式问题列表，或者输入框式
 * 把这些当作一个子功能封装起来，当作一个组件组装到问题单
 * 2. 那么接下来就需要问题单母件了，即每个组件被组装的对象
 */


// 创建问题的元件
function questionCreator( spec, my ) {
	var that = {};

	my 			= my || {};
	my.label 	= spec.label;

	my.renderInput = function () {
		// 组件扩展的地方，用来被重写
	};

	that.render = function ( target ) {
		// 问题列表容器
		var questionWrapper 		= document.createElement('div');
		questionWrapper.className 	= 'question';

		// 问题列表的label div
		var questionLabel 			= document.createElement('div');
		questionLabel.className 	= 'question-label';

		var label 	= document.createTextNode( spec.label );
		questionLabel.appendChild( label );

		// 这里是重点，通过未实现的renderInput去做扩展
		var answer 	= my.renderInput();

		questionWrapper.appendChild( questionLabel );
		questionWrapper.appendChild( answer );

		return questionWrapper;
	};

	return that;
}

var view = {
	render: function ( target, questions ) {
		for ( var i = 0, len = questions.length; i < len; i++ ) {
			target.appendChild( questions[i].render() );
		}
	}
};

// 下拉列表式创建
function choiceQuestionCreator( spec ) {

	var my 		= {},
		that 	= questionCreator( spec, my );

	my.renderInput = function () {
		var input 	= document.createElement('select');
		var len 	= spec.choices.length;

		for ( var i = 0; i < len; i++ ) {

			var option 		= document.createElement('option');
			option.text 	= spec.choices[i];
			option.value 	= spec.choices[i];

			input.appendChild( option );
		}

		return input;
	};

	return that;
}

// 文本框式的创建
function inputQuestionCreator( spec ) {

	var my 		= {},
		that 	= questionCreator( spec, my );

	my.renderInput = function () {
		var input 	= document.createElement('input');
		input.type 	= 'text';

		return input;
	};

	return that;
}


var questions = [
					choiceQuestionCreator( {
						label: '11111',
						choices: ['yes', 'no']
					} ),

					inputQuestionCreator( {
						label: '22222'
					} )
				];

var questionRegion = document.getElementById('question');
view.render( questionRegion, questions );				