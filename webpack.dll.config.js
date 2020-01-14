const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// TODO es6转es5 参考：https://segmentfault.com/a/1190000020664884

// dll文件存放目录
const dllPath = path.join(__dirname, 'public/dll');
module.exports = {
  /* 入口，需要将哪些依赖单独抽取出来，这里我们配置了2个入口，core是抽取一些核心的第3方依赖包，my_common是自己写的一些工具方法 */
  entry: {
    core: ['axios', 'vuex', 'element-ui'],
    my_common: ['./src/common/js/tool.js']
  },
  output: {
    path: dllPath,
    // [name]中的name就是entry中每个入口的key
    filename: "[name].dll.js",
    library: '[name]_[hash]'
  },
  module: {
    rules: [
      /* es6转es5，此时webpack已经能正确的将高版本的js语法转为低版本的语法，但是对于新增的api并不会转化，如promise
        参考：https://segmentfault.com/a/1190000020664884
       */
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(),
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    // 配置 DllPlugin
    new webpack.DllPlugin({
      // 设置manifest.json存储路径
      path: path.join(dllPath, '[name]-manifest.json'),
      // 需与 output.library 保持一致
      name: '[name]_[hash]',
      // manifest 文件中请求的上下文，使用绝对路径
      context: process.cwd()
    })
  ]
};
