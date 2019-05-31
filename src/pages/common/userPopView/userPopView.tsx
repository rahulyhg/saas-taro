import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Block, Icon, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { UserPopViewProps, UserPopViewState } from './userPopView.interface'
import './userPopView.scss'
import _lodash from 'underscore';
import { element } from 'prop-types';
const defaultPhoto = process.env.remoteImgPreUrl + '/images/common/photo.png';
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
@connect(({ userPopView }) => ({
  ...userPopView,
}))

class UserPopView extends Component<UserPopViewProps, UserPopViewState> {
  config: Config = {
    navigationBarTitleText: '选择人员'
  }
  constructor(props: UserPopViewProps) {
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
    console.error("初始化页面")
    this.getMaxOrgByUserId()
  }

  componentDidShow() {
    const { checkedList, checkedUserList } = this.props;
    let findIndex = -1;
    let temp: any = [];
    checkedUserList.forEach(element => {
      findIndex = -1;
      for (let i = 0; i < checkedList.length; i++) {
        if (element.id === checkedList[i].userId) {
          findIndex = i;
        }
      }
      if (findIndex > -1) {
        temp.push(element)
      }
    })
    this.setState({
      checkedUserList: temp,
      checkedOrgList: this.props.checkedOrgList
    })

    // TODO:初始化已选中数据记录
    this.transDataState();
  }

  // 点击下级时 处理数据check状态
  transDataState() {
    const { checkedOrgList, checkedUserList, searchUserList } = this.state;
    const { orgList, userList } = this.props;
    checkedOrgList.forEach(element => {
      orgList.map(obj => {
        if (element.id === obj.id) {
          obj.checked = true;
        }
      })
    })
    checkedUserList.forEach(element => {
      userList.map(obj => {
        if (element.id === obj.id) {
          obj.checked = true;
        }
      })
      searchUserList.map(obj => {
        if (element.id === obj.id) {
          obj.checked = true;
        }
      })
    })
    this.setState({
      orgList: orgList,
      userList: userList,
      count:checkedUserList.length
    })

  }

  // 初始化获取用户最大权限组织&下级组织
  async getMaxOrgByUserId() {
    const {dispatch} = this.props;

    if(this.$router.params.orgId){
      await dispatch({
        type: 'userPopView/getMaxOrgByOrgId',
        payload:{orgId:this.$router.params.orgId}
      });
    }else{
      await dispatch({
        type: 'userPopView/getMaxOrgByUserId'
      });
    }
    this.setState({
      userList: this.props.userList,
      orgList: this.props.orgList,
      breadList: this.state.breadList.concat([this.props.maxOrg])
    })
    this.transDataState();
  }

  async onSearch(e) {
    await this.props.dispatch({
      type: 'userPopView/getUserByUserName',
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
    await this.props.dispatch({
      type: 'userPopView/getOrgAndUserByorgId',
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
      type: 'userPopView/getOrgAndUserByorgId',
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

  // 点击选择组织
  async onOrgCheckClick(orgId, orgName, checked) {
    await this.props.dispatch({
      type: 'userPopView/getUserByorgId',
      payload: {
        orgId: orgId
      }
    });
    const { orgUserList, userList, orgList } = this.props;
    let { checkedUserList, checkedOrgList } = this.state;
    userList.forEach(element => {
      orgUserList.forEach(obj => {
        if (obj.id === element.id) {
          element.checked = !checked
        }
      });
    })
    orgList.forEach(element => {
      if (element.id === orgId) {
        element.checked = !checked
      }
    })
    if (checked) {
      checkedOrgList = checkedOrgList.filter(element => {
        return element.id !== orgId
      })
      checkedUserList = checkedUserList.filter(element => {
        let flag = true;
        orgUserList.forEach(obj => {
          if (obj.id === element.id) {
            flag = false;
          }
        })
        return flag;
      })
    } else {
      checkedOrgList.push({ id: orgId, name: orgName })
      checkedUserList = checkedUserList.concat(orgUserList)
    }
    this.setState({
      userList,
      orgList,
      checkedUserList,
      checkedOrgList,
      count: checkedUserList.length
    })

  }

  // 点击选择用户
  onUserCheckClick(user) {
    let { userList, checkedUserList, searchUserList } = this.state;
    userList.map(element => {
      if (element.id === user.id) {
        element.checked = !user.checked
      }
    })
    searchUserList && searchUserList.map(element => {
      if (element.id === user.id) {
        element.checked = !user.checked
      }
    })
    if (user.checked) {
      checkedUserList.filter(element => {
        return element.id !== user.id
      });
    } else {
      checkedUserList.push({ avatar:user.avatar,id: user.id, userName: user.userName, checked: !user.checked ,mobilePhone:user.telephone})
    }
    this.setState({
      userList: userList,
      searchUserList: searchUserList,
      checkedUserList: checkedUserList,
      count: checkedUserList.length
    })
  }

  onSearchUserCheckClick(user) {
    let { searchUserList, checkedUserList, userList } = this.state;
    searchUserList.map(element => {
      if (element.id === user.id) {
        element.checked = !user.checked
      }
    })
    if (user.checked) {
      checkedUserList.filter(element => {
        return element.id !== user.id
      });
    } else {
      checkedUserList.push({ avatar:user.avatar,id: user.id, userName: user.userName, checked: !user.checked,mobilePhone:user.telephone })
    }
    checkedUserList.forEach(element => {
      userList.map(obj => {
        if (element.id === obj.id) {
          obj.checked = true;
        }
      })
    })
    this.setState({
      userList: userList,
      checkedUserList: checkedUserList,
      count: checkedUserList.length
    })
  }

  // 全选
  onAllCheck() {
    let { allChecked, userList, orgList, checkedOrgList, checkedUserList } = this.state;
    orgList.map(element => {
      element.checked = !allChecked;
    })
    userList.map(element => {
      element.checked = !allChecked;
    })
    if (allChecked) {
      /**
       * 
       */
      checkedOrgList = checkedOrgList.filter(element => {
        let flag = true;
        orgList.forEach(obj => {
          if (obj.id === element.id) {
            flag = false
          }
        });
        return flag;
      })

      checkedUserList = checkedUserList.filter(element => {
        let flag = true;
        userList.forEach(obj => {
          if (obj.id === element.id) {
            flag = false
          }
        });
        return flag;
      });

      orgList.forEach(element => {
        let tempUserList = element.allUser;
        checkedUserList = checkedUserList.filter(element => {
          let flag = true;
          tempUserList.forEach(obj => {
            if (obj.id === element.id) {
              flag = false
            }
          });
          return flag;
        })
      })

    } else {
      // 选择
      let tempUserList: any = [];
      tempUserList = tempUserList.concat(userList);
      orgList.forEach(element => {
        tempUserList = tempUserList.concat(element.allUser)
      })
      checkedOrgList = _lodash.uniq(checkedOrgList.concat(orgList), 'id');
      checkedUserList = _lodash.uniq(checkedUserList.concat(tempUserList), 'id');

    }
    this.setState({
      allChecked: !allChecked,
      userList: userList,
      orgList: orgList,
      checkedOrgList: checkedOrgList,
      checkedUserList: checkedUserList,
      count: checkedUserList.length
    })

  }
  onFocusSearch() {
    this.setState({
      isSearch: !this.state.isSearch
    })
  }
  onConfirmClick() {
    let { checkedUserList } = this.state;
    let checkedList: any = [];
    checkedUserList.forEach(element => {
      checkedList.push({ avatar:element.avatar,userId: element.id, userName: element.userName,mobilePhone:element.mobilePhone })
    });

    this.props.dispatch({
      type: 'userPopView/updateState',
      payload: {
        checkedList:checkedList,
        checkedUserList: this.state.checkedUserList,
        checkedOrgList: this.state.checkedOrgList
      }
    });
    console.warn(this.state, this.props);
    Taro.navigateBack({ delta: 1 });
  }
  render() {
    const { allChecked, count, orgList, userList, breadList, isSearch, searchUserList } = this.state;

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
                <View className='scrollview-item'>选择人员</View>
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
          !isSearch && (
            <View className='flex fx-userPopView-all' onClick={this.onAllCheck}>
              <Image src={allChecked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
              <View className='flex-item'>全选</View>
            </View>
          )
        }

        {
          !isSearch && <View className='fx-userPopView-container'>
            {
              orgList && orgList.map(element => {
                return (
                  <View className='flex van-hairline--bottom' onClick={this.onOrgCheckClick.bind(this, element.id, element.name, element.checked)}>
                    <Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
                    <View className='flex-item'>{element.name}</View>
                    <View className='action van-hairline--left' onClick={this.onClick.bind(this, element.id, element.name)}>下级</View>
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
                  <View className='flex van-hairline--bottom' onClick={this.onUserCheckClick.bind(this, element)}>
                    <View><Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} /></View>
                    <View><Image src={defaultPhoto} style={'width:34px;height:34px;vertical-align:middle;padding-right:12px;'} /></View>
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
                  <View className='flex van-hairline--bottom' onClick={this.onSearchUserCheckClick.bind(this, element)} >
                    <View><Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} /></View>
                    <View><Image src={defaultPhoto} style={'width:34px;height:34px;vertical-align:middle;padding-right:12px;'} /></View>
                    <View className='flex-item'>{element.userName}</View>
                  </View>
                )
              })
            }
          </View>
        }

        <View className='fx-userPopView-footer flex'>
          <View className='flex-item'>已选择{count}人</View>
          <View className='btn' onClick={this.onConfirmClick}>确定</View>
        </View>
      </View>
    )
  }
}

export default UserPopView
