var nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = [{
    target: 'node',
    watch: true,
    watchOptions: {
      ignored: ['/node_modules/', '/dist/']
    },
    entry: {
      server: "./server/server.tsx"
    },
    output: {
        filename: "[name].js",
        path: __dirname,
        libraryTarget: 'commonjs2'
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".less"]
    },

    module: {
        rules: [
            {
              test: /\.less$/,
              loader: 'ignore-loader'
            },
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['env', {
                      'targets': {
                        'node': 'current'
                      }
                    }]
                  ]
                }
              }
            }
        ]
    },
    externals: nodeExternals()
},
{
  plugins: [
     new MiniCssExtractPlugin({
       filename: "[name].css",
     })
   ],

    entry: {
      index: "./src/index.tsx"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    mode: "development",
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".less"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.less$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "less-loader"
                ]
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
}];
