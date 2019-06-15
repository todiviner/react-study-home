import React from 'react'
// 导入 ui 组件
import { Form } from 'semantic-ui-react'

// 导入 css 样式
import './Login.css'

// 导入 跳转路由 组件
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      uname: '',
      pwd: ''
    };
  }
  login = async () => {
    let { uname, pwd } = this.state
    let { history } = this.props
    // await 要在 async 异步函数中才能使用
    // await 在等待结果出来之前，才会执行下一个
    let res = await this.axios.post('users/login', {
      uname,
      pwd
    })
    let { data, meta } = res
    if (meta.status === 200) {
      // 登录已经来过设置 token
      // console.log(11)
      localStorage.setItem('loginToken', data.token)
      // 设置 登录 uid
      localStorage.setItem('uid', data.uid)
      // 需要跳转到 home 页面
      history.push('/home')
    } else {
      console.log(meta.msg)
    }
  }
  render() {
    return (
      <div className="login_container">
        <div className="logn_title">登录</div>
        <div className="login_form">
        <Form onSubmit={this.login}>
          <Form.Field>
            <Form.Input icon='user' iconPosition='left' placeholder='请输入用户名...' size="big" name="uname" onChange={this.handleChange} required autoComplete='off' />
          </Form.Field>
          <Form.Field>
            <Form.Input icon='lock' iconPosition='left' placeholder='请输入密码...' type="password" size="big" autoComplete='off' name="pwd" onChange={this.handleChange} required  />
          </Form.Field>
          <Form.Button positive fluid size="big">登录</Form.Button>
        </Form>
        </div>
      </div>
    );
  }

  handleChange = e => {
    let { name, value } = e.target
    // console.log(name + '----' + value.trim())
    this.setState({
      [name]: value
    })
  }
}

export default withRouter(Login)