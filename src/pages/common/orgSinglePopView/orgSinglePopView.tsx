import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Icon, Block, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { OrgSinglePopViewProps, OrgSinglePopViewState } from './orgSinglePopView.interface'
import './orgSinglePopView.scss'
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
@connect(({ orgSinglePopView }) => ({
  ...orgSinglePopView,
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
      breadList: []
    }
  }

  componentDidMount() {
    this.getMaxOrgByUserId();
  }

  // 初始化获取用户最大权限组织&下级组织
  async getMaxOrgByUserId() {
    await this.props.dispatch({
      type: 'orgSinglePopView/getMaxOrgByUserId'
    });
    let breadList: any = [];
    breadList.push({ id: this.props.maxOrg.orgId, name: this.props.maxOrg.name })
    this.setState({
      breadList: breadList,
      list: this.props.list
    })
    console.error(this.props.maxOrg, this.state.breadList)

  }

  // 搜索
  async onSearch(e) {
    await this.props.dispatch({
      type: 'orgSinglePopView/getOrgByOrgName',
      payload: {
        inputName: e.detail.value
      }
    });
    this.setState({
      list: this.props.searchList
    })
  }

  // 点击下级
  async onClick(orgId, orgName, e) {
    await this.props.dispatch({
      type: 'orgSinglePopView/getOrgAndUserByorgId',
      payload: {
        orgId: orgId
      }
    });
    let { breadList } = this.state;
    breadList.push({ id: orgId, name: orgName })
    this.setState({
      list: this.props.list,
      breadList: breadList
    })
    //Taro.navigateBack({ delta: 1 })
  }

  // 点击选择组织
  onCheckClick(orgId, orgName,orgCode,typeId) {
    this.props.dispatch({
      type: 'orgSinglePopView/updateState',
      payload: {
        checkedOrg: { id: orgId, name: orgName,code:orgCode,typeId:typeId }
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
    const { list, breadList, isSearch } = this.state;

    return (
      <View className='fx-orgSinglePopView-wrap'>
        <View className='fx-orgSinglePopView-search'>
          <View className='form flex'>
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
                <View className='scrollview-item'>选择组织</View>
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
                  <View className='flex-item' onClick={this.onCheckClick.bind(this, item.id, item.name,item.code,item.typeId)} >{item.name}</View>
                  {!isSearch && <View className='action van-hairline--left' onClick={this.onClick.bind(this, item.id, item.name)}>下级</View>}
                </View>
              )
            })
          }
        </View>



      </View>
    )
  }
}

export default OrgSinglePopView
