
const path = require("path");
const webpack = require("webpack");
const webpack_rules = [];
const webpackOption = {
	entry: "./_src/js/main/index.js",
	output: {
		path: path.resolve(__dirname, "assets/js"),
		filename: "bundle.js",
	},
	module: {
		rules: webpack_rules
	}
};
let babelLoader = {
	test: /\.js$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: "babel-loader"
	},
	include: [
		/\/node_modules\/@rebelstack-io\/metaflux/
	]
};
webpack_rules.push(
	{
		test: /\.css$/,
		use: [ 'style-loader', 'css-loader' ]
	}
)
webpack_rules.push(babelLoader);
module.exports = webpackOption;
