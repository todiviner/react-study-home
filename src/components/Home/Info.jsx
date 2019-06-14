import React from 'react'

// 导入 UI 组件
import { Tab, Item, Icon } from 'semantic-ui-react'

// 导入 样式 
import './Info.css'

// 导入 下拉加载 上拉刷新  组件
import Tloader  from 'react-touch-loader'

class Info extends React.Component {
  constructor(props) {
    super(props)
    this.state = {  }
  }
  render() {
    const panes = [
      { menuItem: '资讯', render: () => <Tab.Pane><M1></M1></Tab.Pane> },
      { menuItem: '头条', render: () => <Tab.Pane><M2></M2></Tab.Pane> },
      { menuItem: '问答', render: () => <Tab.Pane><M3></M3></Tab.Pane> }
    ]
    return (
      <div className='info-container'>
        <div className='info-title'>资讯</div>
        <div className='info-content'>
          <Tab panes={panes} />
        </div>
      </div>
    );
  }
}

function M1() {
  return <Loader type={1}></Loader>
}
function M2() {
  return <Loader type={2}></Loader>
}
function M3() {
  return <Loader type={3}></Loader>
}

function Message({ data }) {
  return (
      <Item.Group unstackable>
        {data.map(item => (
          <Item key={item.id}>
            <Item.Image size='small' src='http://47.96.21.88:8086/public/1.png' />

            <Item.Content>
              <Item.Header className='content-title'>{item.info_title}</Item.Header>
              <Item.Meta className='content-message'>$1200 1 Month</Item.Meta>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
  )
}

function Answer({ data }) {
  return (
    <ul className="info-ask-list">
       {data.map(item => (
        <li key={item.id}>
        <div className="title">
          <span className="cate">
            <Icon color="green" name="users" size="small" />
            思维
          </span>
          <span>
            你好你好你好你好你好你好你好你好你好你好你好你好你好你好
          </span>
        </div>
        <div className="user">
          <Icon circular name="users" size="mini" />
          张三的回答
        </div>
        <div className="info">
          你好你好你好你好你好你好你好你好你好你好你好你好你好你好
        </div>
        <div className="tag">
          <span>你好X</span>
          <span>你好X</span>
          <span>你好X</span>
          <span>123个回答</span>
        </div>
      </li>
       ))}
    </ul>
  )
}

// 定义 touch-loader 组件
class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initializing: 1, // 0 不显示进度条 1 加载进度条 2 结束进度条
      hasMore:false,    // 是否显示加载更多
      pagenum: 0,       // 从第几条开始拿
      pagesize: 3,       // 需要获取多少条, 显示的多少条
      list: []          // 加载数据的
    }
  }

  // 获取ajax数据，进行封装，因为多个调用
  loadData() {
    return  this.axios.post('infos/list',{
      type: this.props.type, // 1 (头条) 2 (资讯) 3 (问答)
      pagenum: this.state.pagenum,
      pagesize: this.state.pagesize
    }).then(res => {
      let { data, meta } = res

      if (meta.status === 200) {
        return data.list
      }
    })
  }
  
  async componentDidMount() {
    // 等待这个执行完成，再执行下一个
    let data = await this.loadData()
    let newNum = this.state.pagenum + this.state.pagesize
    this.setState({
      list: data.data,
      initializing: 2,
      pagenum: newNum,
      hasMore: newNum < data.total
    })
  }

  render() {
    let { initializing, hasMore, list } = this.state
    let { type } = this.props
    return (
      <div className="view">

        <Tloader
          className="main"
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          hasMore={hasMore}
          initializing={initializing}
        >
          { type === 3 ? <Answer data={list}></Answer> : <Message data={list}></Message>}
        </Tloader>
       </div> 
    )
  }
  // 添加 下拉事件
  refresh = async (resolve, reject) => {
    this.setState({
      pagenum: 0
    })
    setTimeout( async () => {
      let data = await this.loadData()
      let newNum = this.state.pagenum + this.state.pagesize
      this.setState({
        list: data.data,
        initializing: 2,
        pagenum: newNum,
        hasMore: newNum < data.total
      })
      resolve()
    }, 300);
  }
  // 添加 加载更多事件
  loadMore = async (resolve) => {
    let data = await this.loadData()
    let newNum = this.state.pagenum + this.state.pagesize
    let newList = [...this.state.list, ...data.data]
    this.setState({
      list: newList,
      initializing: 2,
      pagenum: newNum,
      hasMore: newNum < data.total
    })
    resolve()
  }
}

export default Info