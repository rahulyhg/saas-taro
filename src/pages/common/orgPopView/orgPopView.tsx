import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Icon, Block, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { OrgPopViewProps, OrgPopViewState } from './orgPopView.interface'
import './orgPopView.scss'
import _lodash from 'underscore'
import { element } from 'prop-types';
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
@connect(({ orgPopView }) => ({
  ...orgPopView,
}))

class OrgPopView extends Component<OrgPopViewProps, OrgPopViewState> {
  config: Config = {
    navigationBarTitleText: '选择组织'
  }
  constructor(props: OrgPopViewProps) {
    super(props);
    this.state = {
      isSearch: false,
      breadList: [],
      searchValue: '',
      orgList: [],
      checkedOrgList: [],
      allChecked: false,
      searchOrgList: [],
      count: 0
    }
  }

  componentDidMount() {
    this.getMaxOrgByUserId();

  }
  componentWillUpdate() {
  }

  componentDidShow() {
    const { checkedList, checkedOrgList } = this.props;
    let findIndex = -1;
    let temp: any = [];
    checkedOrgList.forEach(element => {
      findIndex = -1;
      for (let i = 0; i < checkedList.length; i++) {
        if (element.id === checkedList[i].orgId) {
          findIndex = i;
        }
      }
      if (findIndex > -1) {
        temp.push(element)
      }
    })
    this.setState({
      checkedOrgList: temp
    })
  }

  async transDataState() {
    const list: any = this.props.list;
    if (list.length > 0) {
      list.forEach(obj => {
        obj.checked = false;
      })
      this.state.checkedOrgList.forEach(element => {
        list.forEach(obj => {
          if (element.id == obj.id) {
            obj.checked = true;
          }
        })
      });

      this.setState({
        orgList: list,
        count: this.state.checkedOrgList.length
      })

    }

  }

  // 初始化获取用户最大权限组织&下级组织
  async getMaxOrgByUserId() {
    const { dispatch } = this.props;
    if(this.$router.params.orgId){
      await dispatch({
        type: 'orgPopView/getMaxOrgByOrgId',
        payload:{orgId:this.$router.params.orgId}
      });
    }else{
      await dispatch({
        type: 'orgPopView/getMaxOrgByUserId'
      });
    }
    
    let { breadList } = this.state;

    breadList = breadList.concat(this.props.maxOrg);
    this.setState({
      breadList: breadList
    });

    this.transDataState();
  }

  // 搜索
  async onSearch(e) {
    await this.props.dispatch({
      type: 'orgPopView/getOrgByOrgName',
      payload: {
        inputName: e.detail.value
      }
    });
    const { searchOrgList } = this.props;
    searchOrgList.map(element => {
      element.checked = false
    })
    this.setState({
      searchOrgList: searchOrgList
    })
    this.transDataState();
  }

  // 点击下级
  async onClick(id, name, e) {

    e.stopPropagation();
    await this.props.dispatch({
      type: 'orgPopView/getOrgAndUserByorgId',
      payload: {
        orgId: id
      }
    });
    if (this.props.list.length > 0) {
      this.setState({
        breadList: this.state.breadList.concat([{ id, name }])
      })

    }
    this.transDataState();
    //Taro.navigateBack({ delta: 1 })
  }

  async onBreadClick(id, index, e) {
    e.stopPropagation();
    await this.props.dispatch({
      type: 'orgPopView/getOrgAndUserByorgId',
      payload: {
        orgId: id
      }
    });

    let { breadList } = this.state;
    //breadList = breadList.splice((index + 1), (breadList.length - index - 1));
    let temppush: any = [];
    for (let i = 0; i < index + 1; i++) {
      temppush.push(breadList[i])
    }
    this.setState({
      //breadList: breadList.splice(index + 1, breadList.length - index - 1)
      breadList: temppush
    })
    console.error(temppush)


    this.transDataState();
    //Taro.navigateBack({ delta: 1 })
  }

  // 点击选择组织
  async onCheckClick(id, name,shortName,typeId,code, checked ,e) {
    e.stopPropagation();
    const { orgList: tempOrgList } = this.state;
    tempOrgList.forEach(element => {
      if (element.id === id) {
        element.checked = !element.checked
      }
    })
    if (checked) {
      const temp = this.state.checkedOrgList.filter(element => {
        return element.id != id
      });
      this.setState({
        checkedOrgList: temp,
        orgList: tempOrgList,
        count: temp.length
      })
    } else {
      const tempCheck = this.state.checkedOrgList.concat({ id, name,typeId:typeId,code:code, checked: !checked,shortName:shortName });
      this.setState({
        checkedOrgList: tempCheck,
        orgList: tempOrgList,
        count: tempCheck.length
      })

    }
  }


  // 点击选择组织
  async onSearchCheckClick(id, name,shortName,typeId,code, checked, e) {
    e.stopPropagation();
    let { searchOrgList: tempOrgList } = this.props;
    let { orgList } = this.state;
    tempOrgList.forEach(element => {
      if (element.id === id) {
        element.checked = !element.checked
      }
    })
    orgList.forEach(element => {
      if (element.id === id) {
        element.checked = !element.checked
      }
    })
    if (checked) {
      const temp = this.state.checkedOrgList.filter(element => {
        return element.id != id
      });
      this.setState({
        checkedOrgList: temp,
        searchOrgList: tempOrgList,
        orgList: orgList,
        count: temp.length
      })

    } else {

      const tempCheck = this.state.checkedOrgList.concat({ id, name,typeId:typeId,code:code, checked: !checked ,shortName:shortName});
      this.setState({
        checkedOrgList: tempCheck,
        searchOrgList: tempOrgList,
        count: tempCheck.length
      })

    }
  }
  // 全选
  async onAllCheck() {
    const orgList = this.state.orgList;
    orgList.map(element => {
      element.checked = !this.state.allChecked
    })
    if (this.state.allChecked) {
      const temp = this.state.checkedOrgList.filter(element => {
        let flag = true;
        for (let i = 0; i < orgList.length; i++) {
          if (element.id === orgList[i].id) {
            flag = false;
            break;
          }
        }
        return flag
      });
      this.setState({
        allChecked: !this.state.allChecked,
        checkedOrgList: temp,
        orgList: this.state.orgList,
        count: temp.length
      })


    } else {
      let tempCheck = this.state.checkedOrgList.concat(orgList);
      tempCheck = _lodash.uniq(tempCheck, 'id');
      this.setState({
        allChecked: !this.state.allChecked,
        checkedOrgList: tempCheck,
        orgList: this.state.orgList,
        count: tempCheck.length
      })

    }
  }

  // 点击确定
  onConfirmClick() {
    let { checkedOrgList } = this.state;
    let checkedList: any = [];
    checkedOrgList.forEach(element => {
      checkedList.push({ orgId: element.id, orgName: element.name,typeId:element.typeId,orgCode:element.code,shortName:element.shortName  })
    });
    this.props.dispatch({
      type: 'orgPopView/updateState',
      payload: {
        checkedOrgList: this.state.checkedOrgList,
        checkedList: checkedList
      }
    });
    console.log(this.state, this.props.checkedList)
    Taro.navigateBack({ delta: 1 });
  }
  onFocusSearch(e) {
    e.stopPropagation();
    this.setState({
      isSearch: !this.state.isSearch
    })
  }

  render() {
    const { breadList, count, orgList: list, allChecked, isSearch, searchOrgList } = this.state;
    return (
      <View className='fx-orgPopView-wrap'>
        <View className='fx-orgPopView-search'>
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
            <View className='flex fx-orgPopView-all' onClick={this.onAllCheck}>
              <Image src={allChecked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
              <View className='flex-item'>全选</View>
            </View>
          )
        }
        {
          !isSearch && (

            <View className='fx-orgPopView-container'>
              {
                list && list.map((item) => {
                  return (
                    <View className='flex van-hairline--bottom'>
                      <Image src={item.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
                      <View className='flex-item' onClick={this.onCheckClick.bind(this, item.id, item.name,item.shortName,item.typeId,item.code, item.checked)} >{item.name}</View>
                      <View className='action van-hairline--left' onClick={this.onClick.bind(this, item.id, item.name)}>下级</View>
                    </View>
                  )
                })
              }
            </View>)
        }

        {
          isSearch && <View className='fx-orgPopView-container'>
            {
              searchOrgList && searchOrgList.map(item => {
                return (
                  <View className='flex van-hairline--bottom'>
                    <Image src={item.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
                    <View className='flex-item' onClick={this.onSearchCheckClick.bind(this, item.id, item.name,item.shortName,item.typeId,item.code, item.checked)} >{item.name}</View>
                  </View>
                )
              })
            }
          </View>
        }

        <View className='fx-orgPopView-footer flex'>
          <View className='flex-item'>已选择{count}个组织</View>
          <View className='btn' onClick={this.onConfirmClick}>确定</View>
        </View>

      </View>
    )
  }
}

export default OrgPopView
