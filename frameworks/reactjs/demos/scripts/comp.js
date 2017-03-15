/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-23 09:57:59
 * @version $Id$
 */




var MessageBox = React.createClass({

	getInitialState: function () {

		return {
			isShow: true,
			clickCount: 0,
		}
	},

	handleClick: function ( e ) {

		this.setState({
			clickCount: this.state.clickCount + 1,
		});
	},

	render: function () {

		return (
			<div>
				<h1>请点击我！！！！</h1>
				<button onClick={this.handleClick}>Click Me</button>
				<div>点击次数：{this.state.clickCount}</div>
			</div>
		);
	}
});