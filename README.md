# vue-extract-plugins
`vue-extract-plugins`记录了提取vue项目中提取第3方依赖及项目中的公共代码，如果项目中不把第3方依赖及公共代码提取出来，
则会造成`chunk-vendors.xxx.js`太过庞大，从而造成页面加载缓慢！

项目参考文章：[Vue多页面优化踩坑记录](https://juejin.im/post/5e1301cb6fb9a048011b5036)
## 项目依赖
功能|依赖文件
----|-----
es6语法转es5语法 | `npm i babel-loader @babel/core @babel/preset-env -D`
es6新api转换 | `npm install --save @babel/polyfill`<br>`npm install --save-dev @babel/plugin-transform-runtime`<br>`npm install --save @babel/runtime-corejs3`
webpack | `npm install webpack webpack-cli -D`
清除文件插件 | `npm install clean-webpack-plugin -D`
将JavaScript或者CSS插入<br>到webpack插件生成的HTML中 | `npm install add-asset-html-webpack-plugin -D`

生成`.babelrc`文件，并写入如下代码：
```
{
"presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

## 使用
1.将`webpack.dll.config.js`、`.babelrc`文件拷贝至项目中

2.修改`webpack.dll.config.js`中的代码

    1.修改dll文件存放目录(根据需要修改，也可以不修改)
    2.修改entry

3.在`vue.config.js`中的`configureWebpack`中添加生成dll文件配置，如
```
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
      // dll最终输出的目录
      outputPath: "./dll"
    });
    config.plugins.push(myCommonDllReference, coreDllReference, addAssetHtmlPlugin);
  }
```
4.在`package.json`文件中的`script`添加一条命令，`"dll": "webpack -p --progress --config ./webpack.dll.config.js"`

## 打包
在执行打包命令前一定要先执行生成dll文件的命令，即先执行`npm run dll`，然后在执行`npm run build`

运行`npm run dll`命令后会在`/public/dll`目录中生成一个`xxx.dll.js`和`xxx.manifest.json`文件，其中`xxx`就是`webpack.dll.config.js`
中`entry`中的key
