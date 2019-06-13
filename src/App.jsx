import React from 'react'
// 导入路由组件
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// 导入需要的组件
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router>
        { /* <div>
          <ul>
            <li>
              <Link to='/login'>登录</Link>
            </li>
            <li>
              <Link to='/home'>首页</Link>
            </li>
          </ul>
        </div>  */}

        {/* 匹配 路由 */}
        <Switch>
          <Redirect exact path='/' to='/login' />
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={Home}></Route>
        </Switch>
      </Router>
    );
  }
}

export default App