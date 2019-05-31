
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block } from '@tarojs/components'
import { AtList, AtListItem, AtCheckbox } from "taro-ui"
import { UserViewProps, UserViewState } from './index.interface'
import { connect } from '@tarojs/redux'
import './index.scss'
import _lodash from 'underscore'
import { element } from 'prop-types';

@connect(({ userPopView ,activityUser}) => ({
    ...activityUser,
    checkedList: userPopView.checkedList
}))
class OrgView extends Component<UserViewProps, UserViewState> {
    config: Config = {
        navigationBarTitleText: '发布报名活动'
    }
    constructor(props: UserViewProps) {
        super(props)
        this.state = {
            checkboxOption: [],
            checkedList: []
        }
    }

    componentDidMount() {

    }
    componentDidShow() {

        let { checkedList, oldCheckedUserList } = this.props;
        let { checkedList: tempCheckedList } = this.state;
        let checkboxOption: any = [];

        oldCheckedUserList.forEach(element => {
            checkboxOption.unshift({
                avatar:element.avatar,
                label: element.userName,
                value: String(element.userId),
                disabled: true
            });
            tempCheckedList.push(String(element.userId))
        });


        let tempCheckboxOption = checkboxOption;
        let findIndex = -1;
        if (checkboxOption.length > 0) {
            checkedList.forEach(element => {
                for (let i = 0; i < checkboxOption.length; i++) {
                    findIndex = -1;
                    if (element.userId == checkboxOption[i].value) {
                        findIndex = i;
                        break;
                    }
                }
                if (findIndex <= -1) {
                    tempCheckboxOption.push({
                        avatar:element.avatar,
                        label: element.userName,
                        value: element.userId
                    })
                    //checkedOrgList.push(element)
                }
                tempCheckedList.push(element.userId);
                tempCheckedList = _lodash.uniq(tempCheckedList)

            })
        } else {
            checkedList.forEach(element => {
                tempCheckboxOption.push({
                    avatar:element.avatar,
                    label: element.userName,
                    value: element.userId
                })
                tempCheckedList.push(element.userId)

            })
            //checkedOrgList = checkedOrgList.concat(checkedList);
        }

        console.log(tempCheckboxOption)
        this.setState({
            checkboxOption: tempCheckboxOption,
            checkedList: tempCheckedList
        })
    }

    // 选择人员
    chooseUser = e => {
        Taro.navigateTo({
            url: '/pages/common/userPopView/userPopView?orgId='+this.$router.params.orgId
            //url: '/subPackageEco/pages/org/index'
        })
    }

    handleChange = value => {
        let _this = this;
        this.setState({
            checkedList: value
        }, () => {

            // 处理组织选择框的状态
            let { checkedList, dispatch } = _this.props;
            let { checkedList: checkedbox } = _this.state;
            let temp: any = [];
            let findIndex = -1;
            if(checkedList.length>0){
                checkedList.forEach(element => {
                    for (let i = 0; i < checkedbox.length; i++) {
                        findIndex = -1;
                        if (element.userId == checkedbox[i]) {
                            findIndex = i;
                            break;
                        }
                    }
                    if (findIndex > -1) {
                        temp.push(element)
                    }
                });
            }else{
                temp = checkedList;
            }
            
            
            dispatch({
                type: 'userPopView/updateState',
                payload: {
                    checkedList: temp
                }
            })
        })

    }

    // 确定选择
    onConfirmClick() {
        const { dispatch } = this.props;
        const { checkedList, checkboxOption } = this.state;

        let temp: any = [];
        checkboxOption.forEach(element => {
            for (let i = 0; i < checkedList.length; i++) {
                if (element.value == checkedList[i]) {
                    temp.push({
                        avatar:element.avatar,
                        userId: element.value,
                        userName: element.label
                    })
                }
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

        const { checkboxOption, checkedList } = this.state
        const count = checkedList.length;
        return (
            <View className='user-wrap'>
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
                                    <AtCheckbox
                                        options={checkboxOption}
                                        selectedList={checkedList}
                                        onChange={this.handleChange.bind(this)}
                                    />
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