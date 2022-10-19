const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, {mode}) => {

    const commonConfig = {
        stats: 'minimal',
        devtool: mode === 'development' ? 'eval-source-map' : false,
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'index.js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader'
                        }
                    ]
                }
            ]
        }
    };

    const clientConfig = {
        ...commonConfig,
        name: 'client',
        target: 'web',
        entry: './src/index.client.ts',
        output: {
            ...commonConfig.output,
            path: `${commonConfig.output.path}/public`
        },
        module: {
            rules: [
                ...commonConfig.module.rules,
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        }, {
                            loader: 'css-loader'
                        }
                    ],
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'index.css'
            })
        ]
    };

    const serverConfig = {
        ...commonConfig,
        name: 'server',
        target: 'node',
        entry: './src/index.server.ts',
        externals: [
            nodeExternals()
        ],
        module: {
            rules: [
                ...commonConfig.module.rules,
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'null-loader'
                        }
                    ],
                }
            ]
        }
    };

    return [
        clientConfig,
        serverConfig
    ];

};
