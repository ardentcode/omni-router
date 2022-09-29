module.exports = () => {

    return {

        target: 'web',
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
                }
            ]
        }

    };

};