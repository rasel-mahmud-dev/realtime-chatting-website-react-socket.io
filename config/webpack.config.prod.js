const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")

const cssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let isProduction  = process.env.NODE_ENV === "production" && true 


let config = {
  mode: "production",
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: "static/js/[name].js",
    publicPath: "/",
    chunkFilename: "static/js/[name].chunk.js"
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'build'),
  //   // compress: true,
  //   hot: true,
  //   historyApiFallback: true,
  //   port: 9000,
  //   open: true
  // },
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
  optimization: {
    minimize: true,
    minimizer: [ 
      new TerserPlugin(),
      new cssMinimizerPlugin({
        minimizerOptions:{
          preset:[
            'default',
            {
              'discardComments': { removeAll: true}
            }
          ]
        }
      }),
    ],

    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },


  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              // "@babel/plugin-transform-runtime",
              // "@babel/plugin-transform-spread",
            ]
          }
        }
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg||woff2||woff||less||ttf||eot)$/,
        loader: "file-loader",
        options: {
          name: "static/fonts/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/images/[name].[ext]',
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: 'public/index.html', filename: 'index.html'}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[id].css',
    }),
    // new webpack.optimize.MinChunkSizePlugin({
    //   minChunkSize: 100
    // })
  ]
}



module.exports = config