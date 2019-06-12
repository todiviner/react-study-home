import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

// 导入样式
import './index.css'
// 导入 ui 组件 样式
import 'semantic-ui-css/semantic.min.css'

// 全局配置 axios
import axios from 'axios'

// 把 axios 配置 到 React.Component 的 原型上，就可以全局 this.axios 调用
React.Component.prototype.axios = axios 

// 全局配置 axios 基础路径 
axios.defaults.baseURL = 'http://47.96.21.88:8086/'

// 响应拦截器就是过滤器，把不要的数据过滤掉，要自己想要的数据
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});


ReactDOM.render(<App />, document.getElementById('root'))

