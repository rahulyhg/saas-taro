import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Block, Icon, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { UserPopViewProps, UserPopViewState } from './userPopView.interface'
import './userPopView.scss'
import _lodash from 'underscore';
import deepClone from 'lodash.clonedeep'
const defaultPhoto = process.env.remoteImgPreUrl + '/images/common/photo.png';
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
import DjLoading from '../djLoading';
import Dimage from '../dimage';
@connect(({ userPopView, loading }) => ({
  ...userPopView,
  loading: loading.models.userPopView
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
      orgList: [],
      userList: [],
      checkedOrgList: [],
      checkedUserList: [],
      searchUserList: []
    }
  }

  componentDidMount() {
    const { checkedList } = this.props;
    if (this.props.checkedList && this.props.checkedList.length > 0) {
      this.setState({
        checkedUserList: checkedList
      }, () => {
        this.getMaxOrgByUserId();
      })
    } else {
      this.getMaxOrgByUserId();
    }
  }

  componentDidShow() {
  }


  transDataState = () => {
    const orgList = deepClone(this.props.orgList);
    const userList = deepClone(this.props.userList);
    const searchUserList = deepClone(this.props.searchUserList);

    const { checkedOrgList, checkedUserList } = this.state;

    checkedOrgList.forEach(element => {
      orgList.map(obj => {
        if (element.orgId === obj.orgId) {
          obj.checked = true;
        }
      })
    })
    checkedUserList.forEach(element => {
      userList.map(obj => {
        if (element.userId === obj.userId) {
          obj.checked = true;
        }
      })
      searchUserList.map(obj => {
        if (element.userId === obj.userId) {
          obj.checked = true;
        }
      })
    })

    this.setState({
      orgList: orgList,
      userList: userList,
      searchUserList: searchUserList,
      count: checkedUserList.length
    })
  }


  // 参数orgId 有则根据orgId捞取下级数据 没有则根据用户最大权限
  getMaxOrgByUserId = async () => {

    const orgId = this.$router.params.orgId;
    const partyUserState = this.$router.params.partyUserState;
    const hasParty = _lodash.isEmpty(partyUserState) && _lodash.isUndefined(partyUserState);
    const { dispatch } = this.props;
    const flag = (!_lodash.isEmpty(orgId) && !_lodash.isUndefined(orgId) && "undefined" != orgId);
    console.error(flag)
    if (flag) {
      await dispatch({
        type: 'userPopView/getMaxOrgByOrgId',
        payload: { orgId: orgId, partyUserState: !hasParty ? partyUserState : '' }
      });
    } else {
      await dispatch({
        type: 'userPopView/getMaxOrgByUserId',
        payload: { partyUserState: !hasParty ? partyUserState : '' }
      });
    }
    this.setState({
      breadList: []
    }, () => {
      this.transDataState();
    })

  }

  onSearch = async e => {
    const partyUserState = this.$router.params.partyUserState;
    const hasParty = !_lodash.isEmpty(partyUserState) && !_lodash.isUndefined(partyUserState);

    const orgId = this.$router.params.orgId;
    const hasOrg = !_lodash.isEmpty(orgId) && !_lodash.isUndefined(orgId) && "undefined"!=orgId;

    await this.props.dispatch({
      type: 'userPopView/getUserByUserName',
      payload: {
        inputName: e.detail.value,
        orgId: hasOrg ? orgId : '',
        partyUserState: hasParty ? partyUserState : ''
      }
    });

    this.transDataState();
  }

  onFocusSearch = e => {
    this.setState({
      isSearch: !this.state.isSearch
    })
  }

  onBreadClick = async (item, index, e) => {
    e.stopPropagation();
    const partyUserState = this.$router.params.partyUserState;
    const hasParty = !_lodash.isEmpty(partyUserState) && !_lodash.isUndefined(partyUserState);

    await this.props.dispatch({
      type: 'userPopView/getOrgAndUserByorgId',
      payload: {
        orgId: item.orgId,
        partyUserState: hasParty ? partyUserState : ''
      }
    });

    let { breadList } = this.state;
    this.setState({
      breadList: _lodash.first(breadList, index + 1)
    }, () => {
      this.transDataState();
    })
  }

  // 选择组织
  onOrgCheckClick = async (item) => {
    const partyUserState = this.$router.params.partyUserState;
    const hasParty = _lodash.isEmpty(partyUserState) && _lodash.isUndefined(partyUserState);
    /*
    await this.props.dispatch({
      type: 'userPopView/getUserByorgId',
      payload: {
        orgId: item.orgId,
        partyUserState: !hasParty ? partyUserState : ''
      }
    });
    */

    //const orgUserList = deepClone(this.props.orgUserList);
    let tempUserList: any = [];
    item.allUser.forEach(element => {
      tempUserList.push({
        userId: element.id,
        partyUserId: element.partyUserId,
        avatar: element.avatar,
        userName: element.userName,
        mobilePhone: element.mobilePhone
      })
    });
    const orgUserList = tempUserList;

    let { checkedUserList, checkedOrgList } = this.state;

    if (item.checked) {
      // 取消
      checkedOrgList = checkedOrgList.filter(element => {
        return element.orgId !== item.orgId
      })
      checkedUserList = checkedUserList.filter(element => {
        let flag = true;
        orgUserList.forEach(obj => {
          if (obj.userId === element.userId) {
            flag = false;
          }
        })
        return flag;
      })
    } else {
      // 选中
      checkedUserList = _lodash.uniq(checkedUserList.concat(orgUserList), 'userId');
      checkedOrgList.push(item);
      checkedOrgList = _lodash.uniq(checkedOrgList, 'orgId');
    }
    this.setState({
      checkedUserList: checkedUserList,
      checkedOrgList: checkedOrgList
    }, () => {
      this.transDataState();
    })
  }

  onClick = async (org, e) => {
    e.stopPropagation();
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    const partyUserState = this.$router.params.partyUserState;
    const hasParty = !_lodash.isEmpty(partyUserState) && !_lodash.isUndefined(partyUserState);

    await this.props.dispatch({
      type: 'userPopView/getOrgAndUserByorgId',
      payload: {
        orgId: org.orgId,
        partyUserState: hasParty ? partyUserState : ''
      }
    })

    this.setState({
      //userList: this.props.userList,
      //orgList: this.props.orgList,
      breadList: this.state.breadList.concat([{ orgId: org.orgId, orgName: org.orgName }])
    }, () => {
      this.transDataState();
    });

  }

  // 选择人员
  onUserCheckClick = (user) => {
    let { userList, checkedUserList, searchUserList } = this.state;
    userList.map(element => {
      if (element.userId === user.userId) {
        element.checked = !user.checked
      }
    })
    searchUserList && searchUserList.map(element => {
      if (element.userId === user.userId) {
        element.checked = !user.checked
      }
    })
    if (user.checked) {
      checkedUserList = checkedUserList.filter(element => {
        return element.userId !== user.userId
      });
    } else {
      checkedUserList.push({
        avatar: user.avatar,
        userId: user.userId,
        partyUserId: user.partyUserId,
        userName: user.userName,
        checked: !user.checked,
        mobilePhone: user.mobilePhone
      })
    }
    this.setState({
      userList: userList,
      searchUserList: searchUserList,
      checkedUserList: checkedUserList,
      count: checkedUserList.length
    })
  }

  // 选择人员
  onSearchUserCheckClick = (user) => {
    let { searchUserList, checkedUserList, userList } = this.state;
    searchUserList.map(element => {
      if (element.userId === user.userId) {
        element.checked = !user.checked
      }
    })
    if (user.checked) {
      checkedUserList = checkedUserList.filter(element => {
        return element.userId !== user.userId
      });
    } else {
      checkedUserList.push({
        avatar: user.avatar,
        userId: user.userId,
        partyUserId: user.partyUserId,
        userName: user.userName,
        checked: !user.checked,
        mobilePhone: user.mobilePhone
      })
    }
    checkedUserList.forEach(element => {
      userList.map(obj => {
        if (element.userId === obj.userId) {
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
  onAllCheck = () => {
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
          if (obj.orgId === element.orgId) {
            flag = false
          }
        });
        return flag;
      })

      checkedUserList = checkedUserList.filter(element => {
        let flag = true;
        userList.forEach(obj => {
          if (obj.userId === element.userId) {
            flag = false
          }
        });
        return flag;
      });

      orgList.forEach(element => {
        let tempUserList: any = [];
        element.allUser.forEach(element => {
          tempUserList.push({
            userId: element.id,
            partyUserId: element.partyUserId,
            avatar: element.avatar,
            userName: element.userName,
            mobilePhone: element.mobilePhone
          })
        });

        checkedUserList = checkedUserList.filter(item => {
          let flag = true;
          tempUserList.forEach(obj => {
            if (obj.id === item.userId) {
              flag = false
            }
          });
          return flag;
        })
      })

    } else {
      // 选择
      let temp: any = [];
      temp = temp.concat(userList);
      orgList.forEach(element => {
        let tempUserList: any = [];
        element.allUser.forEach(element => {
          tempUserList.push({
            userId: element.id,
            partyUserId: element.partyUserId,
            avatar: element.avatar,
            userName: element.userName,
            mobilePhone: element.mobilePhone
          })
        });
        temp = temp.concat(tempUserList)
      })
      checkedOrgList = _lodash.uniq(checkedOrgList.concat(orgList), 'orgId');
      checkedUserList = _lodash.uniq(checkedUserList.concat(temp), 'userId');

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

  // 确定
  onConfirmClick = () => {
    let { checkedUserList, checkedOrgList } = this.state;
    this.props.dispatch({
      type: 'userPopView/updateState',
      payload: {
        checkedList: checkedUserList,
        checkedUserList: checkedUserList,
        checkedOrgList: checkedOrgList
      }
    });
    Taro.navigateBack({ delta: 1 });
  }

  render() {
    const { allChecked, count, orgList, userList, breadList, isSearch, searchUserList } = this.state;
    const { loading } = this.props;
    return (
      <View className='fx-userPopView-wrap' style={{ marginBottom: '160rpx', paddingBottom: '160rpx' }}>
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
                          index != breadList.length - 1 ? <View className='scrollview-item' onClick={this.onBreadClick.bind(this, item, index)}>{item.orgName}</View> :
                            <View className='scrollview-item'>{item.orgName}</View>
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
              <Image src={allChecked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:12px;'} />
              <View className='flex-item'>全选</View>
            </View>
          )
        }

        {
          !isSearch && <View className='fx-userPopView-container'>
            {
              orgList && orgList.map(element => {
                return (
                  <View className='flex van-hairline--bottom' onClick={this.onOrgCheckClick.bind(this, element)}>
                    <Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:12px;'} />
                    <View className='flex-item'>{element.orgName}</View>
                    <View className='action van-hairline--left' onClick={this.onClick.bind(this, element)}>下级</View>
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
                    <View><Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:12px;'} /></View>
                    <View><Dimage src={process.env.apiBackImgPre + element.avatar} type='avatar' /></View>
                    <View className='flex-item'>{element.userName}</View>
                  </View>
                )
              })
            }
          </View>
        }

        {
          !isSearch && userList.length <= 0 && orgList.length <= 0 && <AtDivider content='暂无数据' fontColor='#999' lineColor='#ccc' />
        }

        {
          isSearch && <View className='fx-userPopView-container'>
            {
              searchUserList && searchUserList.map(element => {
                return (
                  <View className='flex van-hairline--bottom' onClick={this.onSearchUserCheckClick.bind(this, element)} >
                    <View><Image src={element.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:12px;'} /></View>
                    <View><Dimage src={process.env.apiBackImgPre + element.avatar} type='avatar' /></View>
                    <View className='flex-item'>{element.userName}</View>
                  </View>
                )
              })
            }

            {
              isSearch && searchUserList.length <= 0 && <AtDivider content='暂无数据' fontColor='#999' lineColor='#ccc' />
            }
          </View>
        }

        <View className='fx-userPopView-footer flex'>
          <View className='flex-item'>已选择{count}人</View>
          <View className='btn' onClick={this.onConfirmClick}>确定</View>
        </View>

        <DjLoading isshow={loading} />
      </View>
    )
  }
}

export default UserPopView
