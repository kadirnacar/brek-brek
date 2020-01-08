const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env, cnf) => {
    const isDevBuild = !(env && env.prod);
    const isBundle = env && env.bundle;
    const output = isDevBuild ? 'dist' : 'prod';
    const config = {
        devServer: {
            host: 'localhost',
            port: 3012,
            hot: true,
            inline: true,
            publicPath: "/",
            historyApiFallback: true,
            contentBase: path.resolve(__dirname, output)
        },
        devtool: isDevBuild ? 'source-map' : 'hidden-source-map',
        mode: isDevBuild ? 'development' : 'production',
        // stats: {
        //     modules: false
        // },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                "@components": path.resolve(__dirname, "src/components"),
                "@containers": path.resolve(__dirname, "src/containers"),
                "@models": path.resolve(__dirname, "src/models"),
                "@reducers": path.resolve(__dirname, "src/reducers"),
                "@services": path.resolve(__dirname, "src/services"),
                "@store": path.resolve(__dirname, "src/store"),
                "@views": path.resolve(__dirname, "src/views"),
                "@utils": path.resolve(__dirname, 'src/utils.ts'),
                "@tools": path.resolve(__dirname, 'src/tools'),
                "@config": path.resolve(__dirname, 'src/config'),
                "@routes": path.resolve(__dirname, 'src/routes'),
                "@Ui": path.resolve(__dirname, 'src/Ui'),
                'react-dom': isDevBuild ? '@hot-loader/react-dom' : 'react-dom'
            }
        },
        entry: {
            'index': ['./src/index.tsx'],
            'login': ['./src/auth.tsx']
        },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    include: [/src/],
                    use: [{
                        loader: 'awesome-typescript-loader',
                        options: {
                            silent: true,
                            useBabel: true,
                            babelCore: "@babel/core",
                            babelOptions: {
                                babelrc: false,
                                presets: [
                                    ["@babel/preset-env", {
                                        "targets": {
                                            "node": "current"
                                        },
                                        "modules": false
                                    }]
                                ]
                            }
                        }
                    }]
                },
                {
                    test: /\.(sa|sc)ss$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDevBuild
                            }
                        },
                        {
                            loader: 'css-modules-typescript-loader'
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDevBuild
                            }
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|bmp)$/,
                    use: 'file-loader?limit=100000&name=img/[name].[ext]'
                },
                {
                    test: /\.woff?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: "file-loader?limit=100000&name=fonts/[name].[ext]&mimetype=application/font-woff"
                },
                {
                    test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: "file-loader?limit=100000&name=fonts/[name].[ext]&mimetype=application/font-woff"
                },
                {
                    test: /\.eot?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: "file-loader?limit=100000&name=fonts/[name].[ext]&mimetype=application/vnd.ms-fontobject"
                },
                {
                    test: /\.[ot]tf?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: "file-loader?limit=100000&name=fonts/[name].[ext]&mimetype=application/octet-stream"
                },
                {
                    test: /\.svg?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: "file-loader?limit=100000&name=fonts/[name].[ext]&mimetype=image/svg+xml"
                }
            ]
        },
        output: {
            path: path.join(__dirname, output),
            publicPath: "/",
            filename: 'js/[name].js',
            hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
            hotUpdateMainFilename: 'hot/[hash].hot-update.json'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // commons: {
                    //     chunks: "initial",
                    //     minChunks: 2,
                    //     maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    //     minSize: 0 // This is example is too small to create commons chunks
                    // },
                    vendor: {
                        test: (module) => {
                            if (module.resource && (/^.*\.(css|scss|sass)$/).test(module.resource)) {
                                return false;
                            }
                            return module.context && module.context.indexOf("node_modules") !== -1;
                        },
                        chunks: "initial",
                        name: "vendor",
                        priority: 10,
                        enforce: true
                    }
                }
            },
            minimizer: [].concat(isDevBuild ? [] : [
                new TerserPlugin(),
                new OptimizeCSSAssetsPlugin({})
            ])
        },
        plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: '[name].css',
                    chunkFilename: '[id].css',
                }),
                new WriteFilePlugin(),
                // new webpack.NoEmitOnErrorsPlugin(),
                // new CleanWebpackPlugin(['*'], {
                //     root: path.resolve(".", "dist"),
                //     exclude: ['main.js'],
                //     verbose: true,
                //     dry: false
                // }),
                new HtmlWebpackPlugin({
                    filename: path.resolve(".", `${output}/index.html`),
                    template: path.resolve("./public", 'index.html'),
                    inject: true,
                    chunks: ['initial', 'index', 'vendor'],
                    cache: false
                }),
                new HtmlWebpackPlugin({
                    filename: path.resolve(".", `${output}/login.html`),
                    template: path.resolve("./public", 'login.html'),
                    inject: true,
                    chunks: ['initial', 'login', 'vendor'],
                    cache: false
                }),
                new CopyWebpackPlugin([{
                    from: 'public/favicon.ico',
                    to: './'
                },{
                    from: 'public/assets',
                    to: 'assets'
                }], {
                    copyUnmodified: true
                }),
                new webpack.optimize.OccurrenceOrderPlugin(),
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
                })
            ]
            // .concat(isHot ? [new webpack.HotModuleReplacementPlugin()] : [])
            .concat(isBundle ? [new BundleAnalyzerPlugin({
                analyzerMode: "static"
            })] : [])
            .concat(isDevBuild ? [
                new webpack.LoaderOptionsPlugin({
                    debug: true,
                    options: {
                        debug: true,
                        cache: true
                    }
                })
            ] : [
                new webpack.LoaderOptionsPlugin({
                    debug: false,
                    options: {
                        debug: false,
                        cache: true
                    }
                })
            ])
    };

    return config;
};