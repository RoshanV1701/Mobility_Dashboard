const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.module.rules.push({
                test: /\.csv$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name].[hash:8][ext]'
                },
                include: path.resolve(__dirname, 'src/data'), // Adjusted to include the data directory at root
            });
            return webpackConfig;
        },
    },
};
