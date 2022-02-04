import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
	entry: './src/index.ts',
	mode: 'production',
	plugins: [
		new HtmlWebpackPlugin( ),
		new webpack.DefinePlugin( {
			'process.env.TERM_PROGRAM':
				JSON.stringify( process.env.TERM_PROGRAM ),
			'process.platform':
				JSON.stringify( process.platform ),
		} ),
	],
}
