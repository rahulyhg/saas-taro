
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block, Image } from '@tarojs/components'
import { AtList, AtListItem, AtCheckbox } from "taro-ui"
import { UserViewProps, UserViewState } from './index.interface'
import { connect } from '@tarojs/redux'
import './index.scss'
import _lodash from 'underscore'
import { element } from 'prop-types';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
import deepClone from 'lodash.clonedeep'
let flag = 0;
@connect(({ userPopView, activityUser }) => ({
    ...activityUser,
    checkedList: userPopView.checkedList
}))

class OrgView extends Component<UserViewProps, UserViewState> {
    config: Config = {
        navigationBarTitleText: '选择人员'
    }
    constructor(props: UserViewProps) {
        super(props)
        this.state = {
            checkboxOption: [],
            checkedList: [],
            count: 0
        }
    }

    componentDidMount() {
        // 初始化进入页面
        let { oldCheckedUserList, checkedUserList } = this.props;

        let checkboxOption: any = [];

        let { checkedList } = this.props;
        let tempUserList = this.$router.params.disabled == '0' ? deepClone(checkedUserList) : deepClone(oldCheckedUserList)

        tempUserList.forEach(element => {
            checkboxOption.push({
                ...element,
                checked: true,
                disabled: this.$router.params.disabled == '0' ? false : true
            });
        });

        checkedList.forEach(element => {
            checkboxOption.push({
                ...element,
                checked: true,
                disabled: false
            });
        });

        checkboxOption = _lodash.uniq(checkboxOption,'userId');

        this.setState({
            checkboxOption: checkboxOption,
            count: checkboxOption.length
        });


        // 可修改是传入初始选中项
        if (this.$router.params.disabled == '0') {
            const { dispatch } = this.props;
            dispatch({
                type: 'userPopView/updateState',
                payload: {
                    checkedList: tempUserList,
                    checkedUserList: tempUserList,
                }
            })
        }

    }
    componentWillUnmount() {
        flag = 0;
    }
    componentDidShow() {
        if (flag == 1) {
            // 非第一次渲染
            // TODO checkedOrgList 深拷贝
            let checkedUserList = deepClone(this.props.checkedList);

            // 可修改 则重新匹配
            if (this.$router.params.disabled == '0') {
                let checkboxOption: any = [];
                checkedUserList.forEach(element => {
                    checkboxOption.unshift({
                        ...element,
                        checked: true,
                        disabled: this.$router.params.disabled == '0' ? false : true
                    });
                });

                this.setState({
                    checkboxOption: checkboxOption,
                    count: checkboxOption.length
                })
            } else {
                let { checkboxOption } = this.state;
                // 去除重复选项
                checkedUserList = checkedUserList.filter(item => {
                    let filterFlag = true;
                    for (let i = 0; i < checkboxOption.length; i++) {
                        if (item.userId == checkboxOption[i].userId) {
                            filterFlag = false;
                            break;
                        }
                    }
                    return filterFlag
                })

                checkedUserList.forEach(element => {
                    checkboxOption.push({
                        ...element,
                        checked: true,
                        disabled: false
                    });
                });

                this.setState({
                    checkboxOption: checkboxOption,
                    count: checkboxOption.length
                })
            }



        } else {
            flag = 1;
        }

    }

    // 选择人员
    chooseUser = e => {
        Taro.navigateTo({
            url: '/pages/common/userPopView/userPopView?orgId=' + this.$router.params.orgId
            //url: '/subPackageEco/pages/org/index'
        })
    }

    handleChange = (item, e) => {
        let count = 0;
        let temp: any = [];
        if (!item.disabled) {
            let { checkboxOption } = this.state;
            checkboxOption.map(obj => {
                if (obj.userId == item.userId) {
                    obj.checked = !obj.checked;
                }
                if (obj.checked) {
                    count++;

                }
                if (!obj.disabled && obj.checked) {
                    temp.push(obj)
                }
            })

            this.setState({
                checkboxOption: checkboxOption,
                count: count
            })

            const { dispatch } = this.props;
            dispatch({
                type: 'userPopView/updateState',
                payload: {
                    checkedList: temp,
                    checkedUserList: temp,
                }
            })
        }
    }

    // 确定选择
    onConfirmClick() {
        const { dispatch } = this.props;
        const { checkboxOption } = this.state;

        let temp: any = [];
        checkboxOption.forEach(element => {
            if (element.checked) {
                temp.push(element)
            }
        })
        dispatch({
            type: 'activityUser/updateState',
            payload: {
                checkedUserList: temp
            }
        })

        Taro.navigateBack({
            delta: 1
        })
    }

    render() {

        const { checkboxOption, checkedList,count } = this.state;
        //const count = checkedList.length;
        return (
            <View className='user-wrap' style={{ marginBottom: '160rpx',paddingBottom:'160rpx'}}>
                <View className='head van-hairline--bottom'>
                    <AtList hasBorder={false}>
                        <AtListItem hasBorder={false} title='选择新的人员' arrow='right' onClick={this.chooseUser} />
                    </AtList>
                </View>

                {
                    checkboxOption.length > 0 ?
                        (
                            <Block>
                                <View className='title'>
                                    已选择的人员
                                </View>
                                <View className='org-container'>
                                    {
                                        checkboxOption.map(item => (
                                            <View className={`at-row van-hairline--bottom ${item.disabled ? 'at-row--disabled' : ''}`}>
                                                <Image src={item.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:8px;'} onClick={this.handleChange.bind(this, item)} />
                                                <View className='at-col' onClick={this.handleChange.bind(this, item)} >{item.userName}</View>
                                            </View>
                                        ))
                                    }
                                </View>
                            </Block>
                        ) : (<Block></Block>)
                }
                <View className='footer van-hairline--top'>
                    <View className='at-row'>
                        <View className='at-col'>已选择{count}人</View>
                        <View className='btn' onClick={this.onConfirmClick}>确定</View>
                    </View>
                </View>


            </View>
        )
    }
}
export default OrgView