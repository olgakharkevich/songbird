// npm i webpack webpack-cli webpack-dev-server html-webpack-plugin clean-webpack-plugin --D
// deploy to gh-pages (also it's necessary check "deploy" script and change folder)
// npm i -D gh-pages
// npm i eslint -D
// npm i prettier -D
// npm i eslint-config-prettier -D
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// npm i cross-env --D
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const filename = (ext) => `[name].${ext}`;
const pages = ['index', 'quiz', 'results'];

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: "./pages/index/index.js",
        quiz: "./pages/quiz/quiz.js",
        results: "./pages/results/results.js",
    },
    mode: 'development',
    devtool: isProd ? false : 'inline-source-map',
    devServer: {
        static: './dist',
        open: ['/index.html'],
        compress: true,
        hot: true,
        port: 3000,
        watchFiles: ['src/pages/index/index.html', 'src/pages/quiz/quiz.html', 'src/pages/results/results.html'],
    },
    output: {    
        filename: `./${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        // Все assets будут складываться в dist/assets
        assetModuleFilename: 'assets/[contenthash][ext][query]', 
    },
    optimization: {
        splitChunks: {
          chunks: "all",
        },
    },
    plugins: [].concat(
        pages.map((page) =>
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname, `src/pages/${page}/${page}.html`),
                filename: `${page}.html`,
                favicon: 'assets/favicon/favicon.svg',
                chunks: [page],
                minify: {
                  collapseWhitespace: isProd,
                },
            })
        ),
        new CleanWebpackPlugin(),
    ),
    module: {
        rules: [
            // HTML-loader
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            // npm i html-loader -D
            /** Babel **/
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
                // npm i babel-loader @babel/core @babel/preset-env -D
            },
            /** CSS */
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                // npm i style-loader css-loader -D
            },
            /** SCSS/SASS */
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
                // npm i style-loader css-loader sass sass-loader -D
            },
            /** Картинки */
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            /** Шрифты */
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            /** SVG */
            {
                test: /\.svg$/,
                type: 'asset/inline',
            },
            /** Audio */
            {
                test: /\.(mp3|wav)$/i,
                type: 'asset/resource',
            },
        ],
    },
};