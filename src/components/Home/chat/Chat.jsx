import React from 'react'

import './Chat.css'

import moment from 'moment'

import ChatWindow from './ChatWindow'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {  
      list: [],
      isShowMessage: false,
      chatInfo: {}
    }
  }

  async componentDidMount() {
    let res = await this.axios.post('chats/list')
    let { meta, data } = res
    
    if (meta.status === 200) {
      this.setState({
        list: data.list
      })
    } else {
      console.log('服务器繁忙，请稍等')
    }
  }
  
  // 进入 聊天
  entryChat = item => {
    this.setState({
      isShowMessage: true,
      chatInfo: {
        from_user: item.from_user,
        to_user: item.to_user,
        avatar: item.avatar,
        username: item.username
      }
    })
  }
  // 关闭 聊天
  closeWindow = () => {
    this.setState({
      isShowMessage: false
    })
  }
  
  render() {
    let { list, isShowMessage, chatInfo } = this.state
    return (
      <div className='chat-container'>
        {/* 条件渲染 聊天信息 */}
        { isShowMessage && <ChatWindow closeWindow={this.closeWindow} chatInfo={chatInfo} />}
        <div className='chat-title'>聊天</div>
        <div className='chat-list'>
        <ul>
          { list.map(item => (
            <li key={item.id} onClick={this.entryChat.bind(this,item)}>
              <div className="avarter">
                <img src={'http://47.96.21.88:8086/' + item.avatar} alt="avarter" />
                <span className="name">{item.username}</span>
                <span className="info">{item.chat_msg}</span>
                <span className="time">{moment(item.ctime).format('HH:mm:ss')}</span>
              </div>
            </li>
          )) }
         </ul>
        </div>
      </div>
    );
  }
}

export default Chat