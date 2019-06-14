## 这是 react + react-router + redux 技术栈

``` 
cross-env 包 是 开发环境依赖的 跨平台依赖
```
+ 在 home 页面用到了 `react-image-gallery`
+ 在 index 进行了全局基础路径配置
+ 进行了 响应拦截 和 请求拦截是 不用自己请求的时候带上 Authorization 
+ 添加了 `react-touch-loader` 包 上拉刷新，下拉加载更多
+ 在 `node_module` 包中 的 `react-scripts/config/webpack.config.js` 配置了 `less less-loader` 支持