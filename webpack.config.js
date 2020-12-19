'use strict';
const resolve = require('resolve');
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const HOST = process.env.HOST || '0.0.0.0'

module.exports = {
  entry: {
    main: "./src/index.js"
  },

  output:{
    filename: "static/js/[name].bundle.js",
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/'
  },


  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    hot: true,
    // host: HOST,
    clientLogLevel: 'silent',
    // proxy:{
    //   "/api/**": {
    //     target: "http://localhost:4002",
    //     pathRewrite: { '^/api': '' },
    //     changeOrigin: true
    //   }
    // }
  },

  plugins: [
     new HtmlWebpackPlugin({ 
      template: "./public/index.html"
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  
  resolve: {
    alias: {
      "components" : path.resolve(__dirname, "..", 'src/components/'),
      "store" : path.resolve(__dirname, "..", 'src/store/'),
      "reducers" : path.resolve(__dirname, "..", 'src/store/reducers/'),
      "actions" : path.resolve(__dirname, "..", 'src/store/actions/'),
      "pages" : path.resolve(__dirname, "..", 'src/pages/'),
      "sass" : path.resolve(__dirname, "..", 'src/sass/'),
      "apis" : path.resolve(__dirname, "..", 'src/apis/'),
      "utils" : path.resolve(__dirname, "..", 'src/utils/'),
      "@app" : path.resolve(__dirname, "..", 'src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options:{
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-runtime"
          ]
        }
      },


      { 
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== 'production',
              // if hmr not work, it force reload
              // reloadAll: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },

      {
        test: /\.(woff2|woff|ttf|eot)$/,
        use:[
          {
            loader: 'file-loader',
            options:{
              name: "[name].[ext]",
              // outputPath: "static/css/static/fonts" 
            }
          }
        ]
      },

      { 
        test: /\.(svg|jpg|png|gif)$/,
        use:[
          {
            loader: 'file-loader',
            options:{
              name: "[name].[ext]",
              // outputPath: "static/fonts" 
            }
          }
        ]
      }
    ]
  },
}
