import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Icon, Block, Text } from '@tarojs/components'
import { AtSearchBar, AtDivider } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { OrgSinglePopViewProps, OrgSinglePopViewState } from './orgSinglePopView.interface'
import './orgSinglePopView.scss'
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
import DjLoading from '../djLoading';
import _lodash from 'underscore'
@connect(({ orgSinglePopView ,loading}) => ({
  ...orgSinglePopView,
  loading:loading.models.orgSinglePopView
}))

class OrgSinglePopView extends Component<OrgSinglePopViewProps, OrgSinglePopViewState> {
  config: Config = {
    navigationBarTitleText: '选择组织'
  }
  constructor(props: OrgSinglePopViewProps) {
    super(props);
    this.state = {
      list: [],
      isSearch: false,
      breadList: [],
      inputName: ''
    }
  }

  componentDidMount() {
    this.getMaxOrgByUserId();
  }

  // 初始化获取用户最大权限组织&下级组织
  async getMaxOrgByUserId() {
    const isMax = this.$router.params.isMax;
    if (!_lodash.isEmpty(isMax) && !_lodash.isUndefined(isMax) && isMax=='1') {
      await this.props.dispatch({
        type: 'orgSinglePopView/getTantentOrg'
      });
    }else{
      await this.props.dispatch({
        type: 'orgSinglePopView/getMaxOrgByUserId'
      });
    }
    
    //let breadList: any = [];
    //breadList.push({ id: this.props.maxOrg.orgId, name: this.props.maxOrg.name })
    this.setState({
      breadList: [],
      list: this.props.list
    })
    console.error(this.props.maxOrg, this.state.breadList)

  }

  // 搜索
  async onSearch(e) {
    await this.props.dispatch({
      type: 'orgSinglePopView/getOrgByOrgName',
      payload: {
        inputName: this.state.inputName,
        orgId: ''
      }
    });
    this.setState({
      list: this.props.searchList
    })
  }

  onSearchClear(e) {
    this.setState({
      inputName: ''
    }, () => {
      this.getMaxOrgByUserId();
    })
  }

  onSearchChange(e) {
    this.setState({
      inputName: e
    })
  }

  // 点击下级
  async onClick(orgId, orgName, e) {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    await this.props.dispatch({
      type: 'orgSinglePopView/getOrgAndUserByorgId',
      payload: {
        orgId: orgId
      }
    });
    let { breadList } = this.state;
    breadList.push({ id: orgId, name: orgName });
    if (this.props.list.length > 0) {
      this.setState({
        list: this.props.list,
        breadList: breadList
      })
    } else {
      Taro.showToast({ title: '暂无下级组织', icon: 'none' })
    }

    //Taro.navigateBack({ delta: 1 })
  }

  // 点击选择组织
  onCheckClick(orgId, orgName, orgCode, typeId) {
    this.props.dispatch({
      type: 'orgSinglePopView/updateState',
      payload: {
        checkedOrg: { id: orgId, name: orgName, code: orgCode, typeId: typeId }
      }
    })
    Taro.navigateBack({ delta: 1 })
  }
  onFocusSearch(e) {
    e.stopPropagation();
    this.setState({
      isSearch: !this.state.isSearch,
      list: this.state.isSearch ? this.props.list : this.props.searchList
    })
  }
  async onBreadClick(id, index, e) {
    e.stopPropagation();
    await this.props.dispatch({
      type: 'orgSinglePopView/getOrgAndUserByorgId',
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
      breadList: temppush,
      list: this.props.list
    })


  }

  render() {
    const { list, breadList, isSearch, inputName } = this.state;
    const { loading } = this.props;
    return (
      <View className='fx-orgSinglePopView-wrap'>
        <View className='fx-orgSinglePopView-search'>
          <AtSearchBar value={inputName} onChange={this.onSearchChange.bind(this)} onActionClick={this.onSearch.bind(this)} onClear={this.onSearchClear.bind(this)} />

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
                          (index != breadList.length - 1) ? <View className='scrollview-item' onClick={this.onBreadClick.bind(this, item.id, index)}>{item.name}</View> :
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

        <View className='fx-orgSinglePopView-container'>
          {
            list && list.map((item) => {
              return (
                <View className='flex van-hairline--bottom'>
                  <View className='flex-item' onClick={this.onCheckClick.bind(this, item.id, item.name, item.code, item.typeId)} >{item.name}</View>
                  {!isSearch && <View className='action van-hairline--left' onClick={this.onClick.bind(this, item.id, item.name)}>下级</View>}
                </View>
              )
            })
          }
        </View>
        {
          list.length <= 0 && <AtDivider content='暂无数据' fontColor='#999' lineColor='#ccc' />
        }

        <DjLoading isshow={loading} />

      </View>
    )
  }
}

export default OrgSinglePopView
