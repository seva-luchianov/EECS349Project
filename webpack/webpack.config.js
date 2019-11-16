/* Author: Seva Luchianov */

const _ = require('lodash');
const path = require('path');

module.exports = _.merge({}, require('./config.js'), {
    output: {
        path: path.resolve(__dirname, '../build'),
    },
    plugins: require('./plugins.js')('dev'),
    mode: 'development',
    watch: true
});