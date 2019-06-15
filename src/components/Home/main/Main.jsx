import React from 'react'

// 导入 UI 组件
import { Input, Grid, Icon, Item, Button, Dimmer, Loader } from 'semantic-ui-react'

// 导入 css 样式
import './Main.css'

// 导入 react-image-gallery 轮播图组件和样式
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgList: [],
      menuList: [],
      infoList: [],
      faqList: [],
      houseList: [],
      loading: true
    }
  }
  // 获取轮播图数据
  /*
  getImgList = async () => {
    let res = await this.axios.post('homes/swipe')
    let { data, meta } = res

    if (meta.status === 200) {
      this.setState({
        imgList: data.list
      })
    } else {
      console.log('服务器繁忙，获取数据失败')
    }
  }
  getMenuList = async () => {
    let res = await this.axios.post('homes/menu')
    let { data, meta } = res

    if (meta.status === 200) {
      this.setState({
        menuList: data.list
      })
    } else {
      console.log('服务器繁忙，获取数据失败')
    }
  }
  getInfoList = async () => {
    let res = await this.axios.post('homes/info')
    let { data, meta } = res

    // console.log(res)
    if (meta.status === 200) {
      this.setState({
        infoList: data.list
      })
    } else {
      console.log('服务器繁忙，获取数据失败')
    }
  }
  getFaqList = async () => {
    let res = await this.axios.post('homes/faq')
    let { data, meta } = res

    if (meta.status === 200) {
      this.setState({
        faqList: data.list
      })
    } else {
      console.log('服务器繁忙，获取数据失败')
    }
  }
  getHouseList = async () => {
    let res = await this.axios.post('homes/house')
    let { data, meta } = res

    if (meta.status === 200) {
      this.setState({
        houseList: data.list
      })
    } else {
      console.log('服务器繁忙，获取数据失败')
    }
  }*/
  requestData = (url, dataName) => {
    return this.axios.post(url).then(res => {
      let { data, meta } = res

      if (meta.status === 200) {
        this.setState({
          // 属性表达式
          [dataName]: data.list
        })
      } else {
        // console.log('服务器繁忙，请等待')
      }
    })
  }
  async componentWillMount() {
    // 把异步请求数据全部变成 同步 然后 代码执行一条一条 下去
    await Promise.all([
      this.requestData('homes/swipe', 'imgList'), // 轮播图部分
      this.requestData('homes/menu', 'menuList'), // 菜单部分
      this.requestData('homes/info', 'infoList'), // 好客资讯部分
      this.requestData('homes/faq', 'faqList'), // 好客问答部分
      this.requestData('homes/house', 'houseList') // 房屋列表部分
    ])
    // console.log('所有的数据全部请求完成了')

    // console.log(this.state.faqList)
    
    this.setState({
      loading: false
    })
  }

  render() {
    return (
      <div className="main">
        <div className="main_search">
          <Input icon={{ name: 'search', circular: true, link: true }} placeholder='搜房源....' />
        </div>
        <div className="main_content">
          {/* 数据进来就加载 */}
          <Dimmer inverted active={this.state.loading} page>
            <Loader>Loading...</Loader>
          </Dimmer>
          {/* 轮播图 */}
          <ImageGallery items={this.state.imgList} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} showBullets={true} autoPlay={true} />
          {/* 菜单部分 */}
          <MenuList data={this.state.menuList}></MenuList>
          {/* 好客资讯部分 */}
          <InfoList data={this.state.infoList}></InfoList>
          {/* 好客问答部分 */}
          <FaqList data={this.state.faqList}></FaqList>
          <HouseList data={this.state.houseList}></HouseList>
        </div>
      </div>
    );
  }
}

export default Main

// 解构参数对象  
// 这是 无状态组件
function MenuList({ data }) { 
  // 就是这样 解构对象
  // let { data } = props  
 return (
   <Grid divided padded className='menu'>
    <Grid.Row columns={4}>
      {data.map(item => 
        <Grid.Column key={item.id}>
          <div className='home-menu-item'>
            <Icon name='home' size='big'></Icon>
          </div>
          <p>{item.menu_name}</p>
      </Grid.Column>)}
    </Grid.Row>
  </Grid>)
}

// 好客资讯部分
function InfoList({ data }) { 
  return (
    <div className='home-msg'>
    <Item.Group>
      <Item className="home-msg-img">
      <Item.Image size='mini' src='http://47.96.21.88:8086/public/zixun.png' />

      <Item.Content verticalAlign="top">
        { data.map(item => 
          <Item.Header key={item.id}>
            <span>限购 ●</span>
            <span>{item.info_title}</span>
          </Item.Header>
          ) }
        <div className='home-msg-more'>
          <Icon name='angle right'></Icon>
        </div>
      </Item.Content>
    </Item>
    </Item.Group>
    </div>
  )
}

// 好客问答部分
function FaqList({ data }) {  
  return (
    <div className='home-ask'>
      <div className='home-ask-title'>好客问答</div>
        <ul>
            { data.map(item => 
              <li key={item.question_id}>
                <div>
                  <Icon color="green" name="question circle outline" />
                  <span>{item.question_name}</span>
                </div>
                <div>
                  { item.question_tag.split(',').map(tag => 
                    <Button key={tag} basic color="green" size="mini">{tag}</Button>
                  ) }
                  <div>
                    {item.atime} ● <Icon name="comment alternate outline" />{' '}
                    {item.qnum}
                  </div>
                </div>
              </li>  
            ) }
        </ul>
    </div>
  )
}

// 房屋列表部分
function HouseList({ data }) {
  // console.log(data)
  let newHouse = []
  let oldHouse = []
  let hireHouse = []
  data.forEach(item => {
    let temp = (
      <Item key={item.id}>
        <Item.Image src="http://47.96.21.88:8086/public/home.png" />
        <Item.Content>
          <Item.Header>{item.home_name}</Item.Header>
          <Item.Meta>
            <span className="cinema">{item.home_desc}</span>
          </Item.Meta>
          <Item.Description>
              { item.home_tags.split(',').map(tag => (
                <Button key={tag} basic color="green" size="mini">{tag}</Button>
              )) }
          </Item.Description>
          <Item.Description>{item.home_price}</Item.Description>
        </Item.Content>
      </Item>)
    // 追加进空数组，然后用空数组进行渲染  
    if (item.home_type === 1) {
      newHouse.push(temp)
    } else if (item.home_type === 2) {
      oldHouse.push(temp)
    } else {
      hireHouse.push(temp)
    }
  })
  // console.log(newHouse)
  return (
    <div>
      <div>
        <div className="home-hire-title">最新开盘</div>
        <Item.Group divided unstackable>
          { newHouse }
        </Item.Group>
      </div>
      <div>
        <div className="home-hire-title">二手精选</div>
        <Item.Group divided unstackable>
          { oldHouse }
        </Item.Group>
      </div>
      <div>
        <div className="home-hire-title">组一个家</div>
        <Item.Group divided unstackable>
          { hireHouse }
        </Item.Group>
      </div>
    </div>
  )
}