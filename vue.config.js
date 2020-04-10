const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
const webpack = require('webpack');
//baseUrl: process.env.NODE_ENV === 'production' ? './' : '/api/',
module.exports = {
	outputDir:process.env.outputDir,
	publicPath: "./",
	devServer: {
		host: "127.0.0.1",
		port: "8088",
		open: true,
		proxy: {
			"/api": {
				target: "http://192.168.16.16:9200",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			}
		},
	},
	productionSourceMap: false,
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
	},
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"windows.jQuery": "jquery"
			})
		]
	}
};
