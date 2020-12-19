const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let isProduction  = process.env.NODE_ENV === "production" && true 

let config = {
  mode: isProduction ? "production" : "development",
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: "static/js/[name].js",
    publicPath: "/",
    chunkFilename: "static/js/[name].chunk.js"
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    // compress: true,
    hot: true,
    historyApiFallback: true,
    port: 3000,
    open: true
  },
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
  stats: {
    preset: 'minimal',
    moduleTrace: true,
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:
            ["@babel/preset-react",  "@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties"
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
    new HtmlWebpackPlugin({template: 'public/index.html'}),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[id].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin()
  ]
}

if(!isProduction){
  config.devtool = 'inline-source-map'
  // config.devtool = 'eval-cheap-module-source-map'
}



module.exports = config