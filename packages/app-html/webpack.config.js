const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {

    const commonRules = [
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

    const commonConfig = {
        stats: 'minimal',
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js']
        }
    };

    const clientConfig = {
        ...commonConfig,
        name: 'client',
        target: 'web',
        entry: './src/index.client.ts',
        output: {
            filename: 'public/index.js'
        },
        plugins: [new MiniCssExtractPlugin({
            filename: "public/style.css"
        })],
        module: {
            rules: [
                ...commonRules,
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                }

            ]
        }
    };

    const serverConfig = {
        ...commonConfig,
        name: 'server',
        target: 'node',
        entry: './src/index.server.ts',
        output: {
            filename: 'index.js'
        },
        externals: [
            nodeExternals()
        ],
        module: {
            rules: commonRules
        }
    };

    return [
        clientConfig,
        serverConfig
    ];

};
