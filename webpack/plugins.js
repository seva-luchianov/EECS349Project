/* Author: Seva Luchianov */

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function() {
    return [
        new CopyWebpackPlugin([{
            from: './src'
        }], {
            ignore: ['js/**/*'],
            copyUnmodified: true
        })
    ];
}