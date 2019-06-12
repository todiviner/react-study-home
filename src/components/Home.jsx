import React from 'react'

import './Home.css'

// 导入 UI 组件模块
import { Grid, Icon } from 'semantic-ui-react'

// 导入 路由需要跳转的组件
import Main from './Home/Main'
import Chat from './Home/Chat'
import Info from './Home/Info'
import My from './Home/My'

// 导入 路由模块
import { NavLink, Switch, Route } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {  }
  }
  render() {
    return (
      <div className="home">
        <div className="home_container">
          <Switch>
            <Route exact path='/home' component={Main}></Route>
            <Route path='/home/info' component={Info}></Route>
            <Route path='/home/chat' component={Chat}></Route>
            <Route path='/home/my' component={My}></Route>
          </Switch>
        </div>
        <div className="home_tabs">
          <Grid.Row columns={4}>
            <Grid.Column>
              <NavLink exact to='/home'>
                <Icon name='home' size='big'></Icon>
                <p>首页</p>
              </NavLink>
            </Grid.Column>
            <Grid.Column>
              <NavLink to='/home/info'>
                <Icon name='search' size='big'></Icon>
                <p>资讯</p>
              </NavLink>
            </Grid.Column>
            <Grid.Column>
              <NavLink to='/home/chat'>
                <Icon name='envelope' size='big'></Icon>
                <p>微聊</p>
              </NavLink>
            </Grid.Column>
            <Grid.Column>
              <NavLink to='/home/my'>
                <Icon name='user' size='big'></Icon>
                <p>我的</p>
              </NavLink>
            </Grid.Column>
        </Grid.Row>
        </div>
      </div>
    )
  }
}

export default Home