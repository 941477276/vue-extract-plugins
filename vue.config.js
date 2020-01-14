const webpack = require('webpack');
const path = require('path');
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

// dll文件存放目录
const dllPath = path.join(__dirname, 'public/dll');
module.exports = {
  publicPath: './',
  configureWebpack(config){

    let coreDllReference = new webpack.DllReferencePlugin({
      //  manifest (或者是内容属性)中请求的上下文，需是绝对地址
      context: process.cwd(),
      /* 这里 core-manifest.json 中的 core 必须与webpack.dll.config.js中entry中的key保持一致，如果有多个则必须写多个 */
      manifest: path.join(dllPath, 'core-manifest.json')
    });

    let myCommonDllReference = new webpack.DllReferencePlugin({
      //  manifest (或者是内容属性)中请求的上下文，需是绝对地址
      context: process.cwd(),
      /* 这里 my_common-manifest.json 中的 my_common 必须与webpack.dll.config.js中entry中的key保持一致，如果有多个则必须写多个 */
      manifest: path.join(dllPath, 'my_common-manifest.json')
    });

    // 将 dll 注入到 生成的 html 模板中
    let addAssetHtmlPlugin = new AddAssetHtmlPlugin({
      // dll文件位置
      filepath: path.resolve(__dirname, "./public/dll/*.js"),
      // html中 dll 引用路径
      publicPath: "./dll",
      // dll文件最终输出的目录，如下配置它会生成在 /js/dll 目录中
      outputPath: "./dll"
    });
    config.plugins.push(myCommonDllReference, coreDllReference, addAssetHtmlPlugin);
  }
};
