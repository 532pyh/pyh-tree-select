const path = require('path');
function resolve(dir) {
    return path.resolve(__dirname, dir)
}
module.exports = {
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        },
    },
    css: {
        extract: false,
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve('packages'),
                'assets': resolve('examples/assets'),
                'views': resolve('examples/views'),
            }
        }, 
        output: {
            libraryExport: 'default'
        }
    },
    outputDir: 'lib',
    productionSourceMap: false,
    devServer: {
        port: 8091,
        hot: true,
        open: 'Google Chrome'
    }
}