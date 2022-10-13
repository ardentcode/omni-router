module.exports = (env, {mode}) => {
    const commonConfig = {
        stats: 'minimal',
        devtool: mode === 'development' ? 'eval-source-map' : false,
        output: {
            library: {
                name: 'UIRouter',
                type: 'umd',
                umdNamedDefine: true
            }
        },
        resolve: {
            extensions: ['.ts', '.js']
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
        entry: './src/index.ts',
        output: {
            ...commonConfig.output,
            filename: 'index.client.js'
        },
        resolve: {
            extensions: ['.client.ts', ...commonConfig.resolve.extensions]
        },
    };

    const serverConfig = {
        ...commonConfig,
        name: 'server',
        target: 'node',
        entry: './src/index.ts',
        output: {
            ...commonConfig.output,
            filename: 'index.server.js'
        },
        resolve: {
            extensions: ['.server.ts', ...commonConfig.resolve.extensions]
        },
    };

    return [clientConfig, serverConfig];

};