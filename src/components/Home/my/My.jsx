import React from 'react'

import { Button, Icon, Grid, Modal } from 'semantic-ui-react'

import './My.css'

// 导入 裁剪图片 组件
import AvatarEditor from 'react-avatar-editor'

class My extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      avatar: '',
      username: '',
      isShowAvatar: false, // 是否弹出选择框
      fileAvatar: '',
      isShowCrop: false
    }
  }

  // 组件挂载后执行
  async componentDidMount() {
    let res = await this.axios.post('my/info',{
      user_id: localStorage.getItem('uid')
    })
    // console.log(res)
    let { data, meta } = res
    if (meta.status === 200) {
      this.setState({
        avatar: data.avatar,
        username: data.username
      })
    }
  }

  // 点击头像，弹出选择框
  showAvatar = () => {
    this.setState({
      isShowAvatar: true
    })
  }
  // 点击 组件的 选择框 的 确定， 然后 跳转到 裁剪框
  showCrop = (file) => {
    this.setState({
      isShowAvatar: false,
      fileAvatar: file,
      isShowCrop: true
    })
  }
  // 服务端已更换数据，到客户端刷新
  closeDrop = (avatar) => {
    this.setState({
      avatar:avatar,
      isShowCrop: false
    })
  }
  render() {
    return (
      <div className='my-container'>
        <div className="my-title">
          <SelectAvatar open={this.state.isShowAvatar} showCrop={this.showCrop}/>
          <CropAvatar open={this.state.isShowCrop} fileAvatar={this.state.fileAvatar} closeDrop={this.closeDrop} />
          <img src={'http://127.0.0.1:9999/public/my-bg.png'} alt="me" />
          <div className="info">
          <div className="myicon">
              {/* 给头像注册点击事件，显示选择头像的弹窗 */}
              <img
                src={this.state.avatar}
                alt="icon"
                onClick={this.showAvatar}
              />
            </div>
            <div className="name">{this.state.username}</div>
            <Button color="green" size="mini">
              已认证
            </Button>
            <div className="edit">编辑个人资料</div>
          </div>
          </div>
          <Grid padded className="my-menu">
          <Grid.Row columns={3}>
            <Grid.Column>
              <Icon name="clock outline" size="big" />
              <div>看房记录</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="yen sign" size="big" />
              <div>我的订单</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="bookmark outline" size="big" />
              <div>我的收藏</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="user outline" size="big" />
              <div>个人资料</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="home" size="big" />
              <div>身份认证</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="microphone" size="big" />
              <div>联系我们</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="my-ad">
          <img src={'http://127.0.0.1:9999/public/ad.png'} alt="" />
        </div>
      </div>
    );
  }
}

export default My

// 选择头像的弹窗组件
class SelectAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
    this.fileRef = React.createRef()
  }

  submitFile = () => {
    // 获取到上传的文件, 传递给父组件
    let file = this.fileRef.current.files[0]
    this.props.showCrop(file)
  }
  render() {
    let { open } = this.props
    return (
      <Modal open={open}>
        <Modal.Header>选择图片</Modal.Header>
        <Modal.Content>
          {/* 非受控组件 */}
          <input type="file" ref={this.fileRef} />
        </Modal.Content>
        <Modal.Actions>
          <Button positive labelPosition='right' icon='checkmark' content='确定' size='small' onClick={this.submitFile} />
        </Modal.Actions>
      </Modal>
    )
  }
}

// 裁切头像的弹窗组件
class CropAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      scale: 1
    };
  }

  // 设置编辑的ref
  setEditorRef = (editor) => this.editor = editor
  
  submitAvatar = async () => {

    // 获取裁切后的图片，转为base64
    let avatar = this.editor.getImageScaledToCanvas().toDataURL()
    let res = await this.axios.post('my/avatar', {
      avatar: avatar
    })

    let { meta } = res 

    if (meta.status === 200) {
      this.props.closeDrop(avatar)
    }

  }
  render() {
    let { open, fileAvatar } = this.props
    return (
      <Modal open={open}>
          <Modal.Header>上传头像</Modal.Header>
          <Modal.Content>
            <AvatarEditor
            ref={this.setEditorRef}
            image={fileAvatar}
            width={200}
            height={200}
            borderRadius={200}
            border={50}
            color={[0, 0, 0, .8]} // RGBA
            scale={this.state.scale}
            />
            <span className="avatar-zoom">缩放:</span>
            <input type="range" min='1' max='2' step='0.05' name='scale' value={this.state.scale} onChange={this.handleScale.bind(this)} />
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              labelPosition='right'
              icon='checkmark'
              content='确定'
              onClick={this.submitAvatar}
            />
          </Modal.Actions>
        </Modal>
    );
  }
  // 监听受控组件
  handleScale = (e) => {
    let { name, value } = e.target
    this.setState({
      [name]: value - 0
    })
  }
}
