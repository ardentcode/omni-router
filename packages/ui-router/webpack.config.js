module.exports = () => {

    const commonConfig = {
        stats: 'minimal',
        devtool: 'eval-source-map',
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
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
                            loader: 'ts-loader',
                        }
                    ]
                }
            ]
        }
    };

    const clientConfig = {
        ...commonConfig,
        target: 'web',
        output: {
            ...commonConfig.output,
            filename: 'index.client.js'
        }
    };

    const serverConfig = {
        ...commonConfig,
        target: 'node',
        output: {
            ...commonConfig.output,
            filename: 'index.server.js'
        }
    };

    return [clientConfig, serverConfig];

};