// webpack config file


module.exports = {

	// 入口文件
	entry: "./src/entry.js",

	// 输出目录和文件
	output: {
		path: "./dist",
		filename: "bundle.js"
	},

	// 模块配置，加载器
	module: {
		loaders: [
			{ 
				test: /\.css$/, loader: 'style!css' 
			},

			{ 
				test: /\.js|jsx$/, loader: ['babel?presets[]=es2015,presets[]=env,presets[]=react'] 
			}
		]
	}

};