import React from 'react'

import { Icon, Form, TextArea, Button } from 'semantic-ui-react'

import './ChatWindow.css'
import { parse } from '@babel/parser';

import handle from './wsmain.js'

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: [],
      client: '',
      msgContent: '',
      avatar: '',
    };
  }

  getChatList = async () => {
    let res = await this.axios.post('chats/info', {
      from_user: this.props.chatInfo.from_user,
      to_user: this.props.chatInfo.to_user 
    })
    let { meta, data } = res

    // console.log(res)

    if (meta.status === 200) {
      this.setState({
        message: data.list
      })
    }
  }

  // 聊天窗口组件在挂载的时候，获取聊天列表信息
  async componentDidMount() {
      let res = await this.axios.post('my/info',{
        user_id: localStorage.getItem('uid')
      })
      // console.log(res)
      let { data, meta } = res
      if (meta.status === 200) {
         // 通过webSocket连接服务器，得到 client 对象
        let currentUser = localStorage.getItem('uid') - 0
        // 参数1：连接聊天服务器的id
        // 参数2：回调函数，服务器每次给发送的消息，都在data中
        // 返回值：client 对象
        let client = handle(currentUser, data => {
          
          console.log(data.content)
          let newData = JSON.parse(data.content)
          let newList = [...this.state.message, newData]

          this.setState({
            message: newList
          })
        })

        this.setState({
          client: client,
          avatar: data.avatar,
        })
      }
      this.getChatList()
  } 
  
  // 给服务器发送数据
  sendMsg = () => {
    // 给服务器发送的数据包含：
    // from_user: 从谁发
    // to_user: 给谁发
    // this.state.msgContent: 发送的内容

    let pdata = {
      id: new Date().getTime(),
      from_user: this.props.chatInfo.from_user,
      to_user: this.props.chatInfo.to_user,
      chat_msg: this.state.msgContent,
      avatar: this.state.avatar
    }
    // 把消息发送出去
    this.state.client.emitEvent('msg_text_send', JSON.stringify(pdata))

    // 重新渲染聊天列表
    let newList = [...this.state.message, pdata]
    this.setState({
      message: newList,
      msgContent: ''
    })

    // console.log(pdata)
  }

  handleChange = e => {
    let { value } = e.target
    this.setState({
      msgContent: value
    })
  }

  render() {

    let { message } = this.state

    // 判断 uid 是否是 from_user 同一id
    const uid = localStorage.getItem('uid') - 0

    return (
      <div className="chat-window">
        <div className="chat-window-title">
          <Icon
            name="angle left"
            className="chat-ret-btn"
            size="large"
            onClick={this.props.closeWindow}
          />
          <span>{this.props.chatInfo.username}</span>
        </div>
        <div className="chat-window-content">
          <ul>
                {/* // 通过currentUser与from_user去比较 */}
                {message.map(item => (
                  <li className={ uid === item.from_user ? 'chat-info-right' : 'chat-info-left' } key={item.id}>
                    {/* 这个头像显示是错误 */}
                    <img src={'http://47.96.21.88:8086/' + item.avatar} alt="" />
                    <span>{item.chat_msg}</span>
                  </li>
                ))}
          </ul>
        </div>
        <div className="chat-window-input">
          <Form>
            <TextArea placeholder="请输入内容..." value={this.state.msgContent} onChange={this.handleChange} />
            <Button onClick={this.props.closeWindow}>关闭</Button>
            <Button primary onClick={this.sendMsg}>
              发送
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default ChatWindow