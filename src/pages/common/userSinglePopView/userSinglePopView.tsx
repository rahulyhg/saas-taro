import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Block, Icon, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { UserSinglePopViewProps, UserSinglePopViewState } from './userSinglePopView.interface'
import './userSinglePopView.scss'
import _lodash from 'underscore';
import { element } from 'prop-types';
const defaultPhoto = process.env.remoteImgPreUrl + '/images/common/photo.png';
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
import DjLoading from '../djLoading';
import Dimage from '../dimage';
@connect(({ userSinglePopView,loading }) => ({
  ...userSinglePopView,
  loading:loading.models.userSinglePopView
}))

class UserSinglePopView extends Component<UserSinglePopViewProps, UserSinglePopViewState> {
  config: Config = {
    navigationBarTitleText: '选择人员'
  }
  constructor(props: UserSinglePopViewProps) {
    super(props)
    this.state = {
      isSearch: false,
      searchValue: '',
      allChecked: false,
      breadList: [],
      count: 0,
      ...this.props
    }
  }

  componentDidMount() {
    this.getMaxOrgByUserId()
  }

  componentDidShow() {
    this.setState({
      checkedOrgList: this.props.checkedOrgList,
      checkedUserList: this.props.checkedUserList
    })
    // TODO:初始化已选中数据记录
    this.transDataState();
  }

  // 点击下级时 处理数据check状态
  transDataState() {
    const { orgList, userList } = this.props;
    this.setState({
      orgList: orgList,
      userList: userList
    })

  }

  // 初始化获取用户最大权限组织&下级组织
  async getMaxOrgByUserId() {
    await this.props.dispatch({
      type: 'userSinglePopView/getMaxOrgByUserId'
    })
    this.setState({
      userList: this.props.userList,
      orgList: this.props.orgList,
      //breadList: this.state.breadList.concat([this.props.maxOrg])
      breadList: []
    })
  }

  async onSearch(e) {
    await this.props.dispatch({
      type: 'userSinglePopView/getUserByUserName',
      payload: {
        inputName: e.detail.value
      }
    });
    const { searchUserList } = this.props;
    this.setState({
      searchUserList: searchUserList
    });
    this.transDataState();
  }

  // 点击下级
  async onClick(id, name, e) {
    e.stopPropagation();
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    await this.props.dispatch({
      type: 'userSinglePopView/getOrgAndUserByorgId',
      payload: { orgId: id }
    })

    this.setState({
      //userList: this.props.userList,
      //orgList: this.props.orgList,
      breadList: this.state.breadList.concat([{ id: id, name: name }])
    });
    this.transDataState();
  }

  async onBreadClick(id, index, e) {
    e.stopPropagation();
    await this.props.dispatch({
      type: 'userSinglePopView/getOrgAndUserByorgId',
      payload: {
        orgId: id
      }
    });
    let { breadList } = this.state;
    let temppush: any = [];
    for (let i = 0; i < index + 1; i++) {
      temppush.push(breadList[i])
    }
    this.setState({
      breadList: temppush
    })
    this.transDataState();
  }



  // 点击选择用户
  onUserCheckClick(id, userName, avatar) {
    this.props.dispatch({
      type: 'userSinglePopView/updateState',
      payload: {
        checkedUser: { id: id, userName: userName, avatar: avatar }
      }
    })
    Taro.navigateBack({ delta: 1 })
  }


  onFocusSearch() {
    this.setState({
      isSearch: !this.state.isSearch
    })
  }

  render() {
    const { orgList, userList, breadList, isSearch, searchUserList } = this.state;
    const { loading } = this.props;
    return (
      <View className='fx-userPopView-wrap'>
        <View className='fx-userPopView-search'>
          <View className='form flex' >
            <Icon type='search' size='14' />
            {
              isSearch ? (
                <Block>
                  <Input className='flex-item' type='text' focus onConfirm={this.onSearch} />
                  <Text onClick={this.onFocusSearch}>取消</Text>
                </Block>
              ) : (<Input className='flex-item' type='text' placeholder='搜索' disabled onClick={this.onFocusSearch} />)
            }
          </View>
          {
            !isSearch && (
              <View className='scrollview' >
                <View className='scrollview-item' onClick={this.getMaxOrgByUserId}>首页</View>
                {
                  breadList && breadList.map((item, index) => {
                    return (
                      <Block>
                        <Image src={arrowImg} style={'width:20px;height:20px;vertical-align:middle'} />
                        {
                          index != breadList.length - 1 ? <View className='scrollview-item' onClick={this.onBreadClick.bind(this, item.id, index)}>{item.name}</View> :
                            <View className='scrollview-item'>{item.name}</View>
                        }
                      </Block>
                    )
                  })
                }
              </View>
            )
          }
        </View>

        {
          !isSearch && <View className='fx-userPopView-container'>
            {
              orgList && orgList.map(element => {
                return (
                  <View className='flex van-hairline--bottom'>

                    <View className='flex-item'>{element.orgName}</View>
                    <View className='action van-hairline--left' onClick={this.onClick.bind(this, element.orgId, element.orgName)}>下级</View>
                  </View>
                )
              })
            }
          </View>
        }

        {
          !isSearch && <View className='fx-userPopView-container'>
            {
              userList && userList.map(element => {
                return (
                  <View className='flex van-hairline--bottom' onClick={this.onUserCheckClick.bind(this, element.userId, element.userName)}>
                    <View><Dimage src={process.env.apiBackImgPre+element.avatar} type='avatar' /></View>
                    <View className='flex-item'>{element.userName}</View>
                  </View>
                )
              })
            }
          </View>
        }

        {
          isSearch && <View className='fx-userPopView-container'>
            {
              searchUserList && searchUserList.map(element => {
                return (
                  <View className='flex van-hairline--bottom' onClick={this.onUserCheckClick.bind(this, element.id, element.userName, element.avatar)} >
                    <View><Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} /></View>
                    <View><Dimage src={process.env.apiBackImgPre+element.avatar} type='avatar' /></View>
                    <View className='flex-item'>{element.userName}</View>
                  </View>
                )
              })
            }
          </View>
        }

        <DjLoading isshow={loading} />
      </View>
    )
  }
}

export default UserSinglePopView
