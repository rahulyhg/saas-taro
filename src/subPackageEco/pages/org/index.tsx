
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block } from '@tarojs/components'
import { AtList, AtListItem, AtCheckbox } from "taro-ui"
import { OrgViewProps, OrgViewState } from './index.interface'
import { connect } from '@tarojs/redux'
import './index.scss'
import _lodash from 'underscore'

@connect(({ orgPopView, activityOrg }) => ({
    ...activityOrg,
    checkedList: orgPopView.checkedList
}))
class OrgView extends Component<OrgViewProps, OrgViewState> {
    config: Config = {
        navigationBarTitleText: '发布报名活动'
    }
    constructor(props: OrgViewProps) {
        super(props)
        this.state = {
            checkboxOption: [],
            checkedList: []
        }
    }
    

    componentDidMount() {
        //console.log("mount")
        //isFirst = true;
        //this.initCheckBox()
    }
    componentWillUnmount() {
        
    }
    componentDidShow() {

        // debugger
        let { checkedList, oldCheckedOrgList } = this.props;
        let { checkedList: tempCheckedList } = this.state;
        let checkboxOption: any = [];

        oldCheckedOrgList.forEach(element => {
            checkboxOption.unshift({
                label: element.orgName,
                value: String(element.orgId),
                disabled: true
            });
            tempCheckedList.push(String(element.orgId))
        });


        let tempCheckboxOption = checkboxOption;
        let findIndex = -1;
        if (checkboxOption.length > 0) {
            checkedList.forEach(element => {
                for (let i = 0; i < checkboxOption.length; i++) {
                    findIndex = -1;
                    if (element.orgId == checkboxOption[i].value) {
                        findIndex = i;
                        break;
                    }
                }
                if (findIndex <= -1) {
                    tempCheckboxOption.push({
                        label: element.orgName,
                        value: element.orgId
                    })
                    //checkedOrgList.push(element)
                }
                tempCheckedList.push(element.orgId);
                tempCheckedList = _lodash.uniq(tempCheckedList)

            })
        } else {
            checkedList.forEach(element => {
                tempCheckboxOption.push({
                    label: element.orgName,
                    value: element.orgId
                })
                tempCheckedList.push(element.orgId)

            })
            //checkedOrgList = checkedOrgList.concat(checkedList);
        }

        console.log(tempCheckboxOption)
        this.setState({
            checkboxOption: tempCheckboxOption,
            checkedList: tempCheckedList
        })

    }

    // 选择组织
    chooseOrg = e => {
        Taro.navigateTo({
            url: '/pages/common/orgPopView/orgPopView?orgId='+this.$router.params.orgId
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

            if (checkedList.length > 0) {
                checkedList.forEach(element => {
                    for (let i = 0; i < checkedbox.length; i++) {
                        findIndex = -1;
                        if (element.orgId == checkedbox[i]) {
                            findIndex = i;
                            break;
                        }
                    }
                    if (findIndex > -1) {
                        temp.push(element)
                    }
                });
            } else {
                temp = checkedList;
            }
            dispatch({
                type: 'orgPopView/updateState',
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
                        orgId: element.value,
                        orgName: element.label
                    })
                }
            }
        })
        console.error(temp)
        dispatch({
            type: 'activityOrg/updateState',
            payload: {
                checkedOrgList: temp
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
            <View className='org-wrap'>
                <View className='head van-hairline--bottom'>
                    <AtList hasBorder={false}>
                        <AtListItem hasBorder={false} title='选择新的组织' arrow='right' onClick={this.chooseOrg} />
                    </AtList>
                </View>

                {
                    checkboxOption.length > 0 ?
                        (
                            <Block>
                                <View className='title'>
                                    已选择的组织
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
                        <View className='at-col'>已选择{count}个组织</View>
                        <View className='btn' onClick={this.onConfirmClick}>确定</View>
                    </View>
                </View>


            </View>
        )
    }
}
export default OrgView