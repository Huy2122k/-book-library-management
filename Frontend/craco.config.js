const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: {
                        '@primary-color': '#2596be',
                        '@border-radius-base': '8px'
                    },
                    javascriptEnabled: true
                }
            }
        }
    }]
};