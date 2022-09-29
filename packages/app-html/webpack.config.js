const nodeExternals = require('webpack-node-externals');

module.exports = () => {

    const commonConfig = {
        stats: 'minimal',
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts']
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
                },
                {
                    test: /\.html?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'raw-loader'
                        }
                    ]
                }
            ]
        }
    };

    const clientConfig = {
        name: 'client',
        target: 'web',
        entry: './src/index.client.ts',
        output: {
            filename: 'public/index.js'
        },
        ...commonConfig
    };

    const serverConfig = {
        name: 'server',
        target: 'node',
        entry: './src/index.server.ts',
        output: {
            filename: 'index.js'
        },
        externals: [
            nodeExternals()
        ],
        ...commonConfig
    };

    return [
        clientConfig,
        serverConfig
    ];

};