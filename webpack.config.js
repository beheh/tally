module.exports = {
	entry: __dirname + '/src/Browser.tsx',
	output: {
		filename: 'tally.js',
	},
	resolve: {
		extensions: ['.webpack.js', '.js', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					'babel-loader?presets[]=react&presets[]=es2015',
					'awesome-typescript-loader',
				],
			}
		]
	},
	node: {
		__dirname: true,
		fs: true,
		net: true,
	},
	target: 'electron-renderer',
};
