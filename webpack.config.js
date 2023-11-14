path = require('path');

module.exports = {
    mode: "development",
    entry : {
        controller: "./src/controller.js",
        
    },
    output: {
        filename: "main.bundle.js",
        path: path.resolve(__dirname, "dist"),    
    },
    devtool: 'inline-source-map',
    devServer : {static: "./dist"},
    
}