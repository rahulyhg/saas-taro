import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Picker, Block } from '@tarojs/components'
import { AtInput, AtProgress, AtTextarea, AtButton, AtIcon, AtSwitch, AtTabs, AtTabsPane } from 'taro-ui'
import Dimage from '../../../../../src/pages/common/dimage'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { EditProps, EditState } from './index.interface'
import './index.scss'
// import {  } from '../../components'
import { dateFormat } from '@/src/utils/common'
@connect(({ surveyEdit, activityOrg, activityUser, orgSinglePopView }) => ({
    ...surveyEdit,
    oldCheckedOrgList: activityOrg.oldCheckedOrgList,
    oldCheckedUserList: activityUser.oldCheckedUserList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg
}))

class Edit extends Component<EditProps, EditState> {
    config: Config = {
        navigationBarTitleText: '调查详情'
    }
    constructor(props: EditProps) {
        super(props)
        this.state = {
            redNeed: 0,
            surveyFormData: {},
            currentTab: 0
        }
    }

    componentDidMount() {
        this.initData()
    }

    componentDidShow() {
        console.log(this.props.checkedOrgList)
        console.log(this.props.checkedUserList)
        this.setState({
            checkedOrgList: this.props.checkedOrgList,
            checkedUserList: this.props.checkedUserList
        })
    }

    componentWillUnmount() {
        console.log('卸载的时候:清除组织和人员选择');
        const { dispatch } = this.props;
        dispatch({
            type: 'popView/clear'
        });
    }

    initData = async () => {
        const { dispatch } = this.props;
        if (this.state.currentTab == 0) {
            await dispatch({
                type: 'surveyEdit/surveyResult',
                payload: { id: this.$router.params.id }
            })
            console.log(this.props.surveyResult)
        } else {
            await dispatch({
                type: 'surveyEdit/surveyDetail',
                payload: { id: this.$router.params.id }
            })

            let tempOrgs: any = [];
            let tempUsers: any = [];
            this.props.surveyFormData.orgs.forEach(element => {
                tempOrgs.push({
                    orgId: element.objectId,
                    orgName: element.objectName
                })
            });
            this.props.surveyFormData.users.forEach(element => {
                tempUsers.push({
                    userId: element.objectId,
                    avatar: element.objectAvatar,
                    userName: element.objectName
                })
            });
            dispatch({
                type: 'activityOrg/updateState',
                payload: {
                    oldCheckedOrgList: tempOrgs,
                    checkedOrgList: tempOrgs
                }
            })

            dispatch({
                type: 'activityUser/updateState',
                payload: {
                    oldCheckedUserList: tempUsers,
                    checkedUserList: tempUsers
                }
            })

            dispatch({
                type: 'orgSinglePopView/updateState',
                payload: {
                    checkedOrg: {
                        id: this.props.surveyFormData.orgId,
                        code: this.props.surveyFormData.orgCode,
                        name: this.props.surveyFormData.orgName
                    }
                }
            })

            const startTime = dateFormat(this.props.surveyFormData.startTime.replace(/-/g, '/'), 'yyyy-MM-dd');
            const endTime = dateFormat(this.props.surveyFormData.endTime.replace(/-/g, '/'), 'yyyy-MM-dd');
            const nowTime = dateFormat(new Date(), 'yyyy-MM-dd');

            this.setState({
                checkedOrgList: tempOrgs,
                checkedUserList: tempUsers,
                surveyFormData: {
                    ...this.props.surveyFormData
                },
                isBegin: nowTime >= startTime,
                isEnd: nowTime > endTime
            })
        }
    }


    handleTabClick(val) {
        console.log(val);
        this.setState({
            currentTab: val
        }, () => {
            this.initData();
        });

    }

    // 标题
    handleTitleChange = e => {
        this.setState({

            surveyFormData: {
                ...this.state.surveyFormData,
                //title: e.detail.value
                title: e
            }
        })
    }

    // 内容
    handleContentChange = e => {
        this.setState({
            surveyFormData: {
                ...this.state.surveyFormData,
                //content: e.detail.value
                content: e
            }
        })
    }


    // 日期选择
    onDateChange = (type, e) => {
        if (type === 'start') {

            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    startTime: e.detail.value
                }
            })
        } else {

            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    endTime: e.detail.value
                }
            })
        }
        console.log(type, e)
    }

    // 发起组织
    handleChooseStartOrg = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }

        Taro.navigateTo({
            url: '/pages/common/orgSinglePopView/orgSinglePopView'
        })
    }

    // 组织选择
    handleChooseOrg = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }

        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                title: '请先选择发起组织',
                duration: 2000,
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            //url: '/pages/common/orgPopView/orgPopView'
            url: '/subPackageEco/pages/org/index?orgId=' + this.props.checkedOrg.id
        })
    }

    // 人员选择
    handleChooseUser = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }

        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                title: '请先选择发起组织',
                duration: 2000,
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            //url: '/pages/common/userPopView/userPopView'
            url: '/subPackageEco/pages/user/index?orgId=' + this.props.checkedOrg.id
        })
    }

    // 设置封面
    chooseCover = e => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {
                let filepath = res && res.tempFilePaths[0];
                _this.uploadFile(filepath);
            }
        })
    }
    uploadFile = filepath => {
        let _this = this;
        /*
        Taro.uploadFile({
            url: process.env.apiHost + '/api/common/imageUpload',
            filePath: filepath,
            name: 'file',
            formData: { businessName: 'activity' }
        }).then(res => {
            console.log(res);
            //const { path } = res.data;
            this.setState({
                surveyFormData: {
                    ..._this.state.surveyFormData,
                    cover: JSON.parse(res.data).path,
                    coverId: JSON.parse(res.data).id
                }
            })
        });
        */
        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadSingleFile',
            payload: {
                filePath: filepath,
                businessName: 'activity'
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        surveyFormData: {
                            ..._this.state.surveyFormData,
                            cover: res.data.path,
                            coverId: res.data.id
                        }
                    });
                }
            }
        });
    }

    redInputChange = e => {
        this.setState({
            redTotalNum: Number(e),
            redPayTotal: (Math.ceil(Number(e) * Number(this.state.surveyFormData.redMoney) * 1.006 * 1000) / 1000).toFixed(2)
        })
    }

    redSwitchChage = e => {
        this.setState({
            redNeed: e ? 1 : 0,
            redTotalNum: e ? this.state.redTotalNum : 0,
            redPayTotal: e ? this.state.redPayTotal : 0
        })
    }

    onSubmit = e => {
        const { dispatch, oldCheckedOrgList, oldCheckedUserList } = this.props;
        let orgs: any = [];
        let users: any = [];
        this.state.checkedOrgList.forEach(element => {
            let findIndex = -1;
            oldCheckedOrgList.forEach((item, index) => {
                if (item.orgId == element.orgId) {
                    findIndex = index;
                }
            })
            if (findIndex <= -1) {
                orgs.push({
                    objectId: element.orgId,
                    objectName: element.orgName
                })
            }

        });
        this.state.checkedUserList.forEach(element => {
            let findIndex = -1;
            oldCheckedUserList.forEach((item, index) => {
                if (item.userId == element.userId) {
                    findIndex = index;
                }
            })
            if (findIndex <= -1) {
                users.push({
                    objectId: element.userId,
                    objectAvatar: element.avatar,
                    objectName: element.userName
                })
            }
        });
        const {
            id,
            title,
            content,
            startTime,
            endTime,
            cover,
            coverId,
        } = this.state.surveyFormData;
        const { redNeed } = this.state;
        let payload = {};
        if (redNeed == 1) {
            payload = {
                id,
                title,
                content,
                startDate: startTime.substring(0, 10),
                endDate: endTime.substring(0, 10),
                orgs,
                users,
                cover,
                coverId,
                redNeed,
                redPayTotal: this.state.redPayTotal,
                redTotalNum: this.state.redTotalNum
            }
        } else {
            payload = {
                id,
                title,
                content,
                startDate: startTime.substring(0, 10),
                endDate: endTime.substring(0, 10),
                orgs,
                users,
                cover,
                coverId,
                redNeed
            }
        }

        payload = {
            ...payload,
            orgId: this.props.checkedOrg.id,
            orgName: this.props.checkedOrg.name,
            orgCode: this.props.checkedOrg.code,
        }

        dispatch({
            type: 'surveyEdit/edit',
            payload: {
                ...payload
            }
        })
    }



    render() {

        const { surveyFormData, checkedOrgList, checkedUserList, redNeed, redTotalNum, redPayTotal, isBegin, isEnd } = this.state;
        const { surveyResult, checkedOrg } = this.props;
        const startTimeFormat = this.state.surveyFormData.startTime?dateFormat(this.state.surveyFormData.startTime.replace(/-/g, '/'), 'yyyy年MM月dd日'):'';
        const endTimeFormat = this.state.surveyFormData.endTime?dateFormat(this.state.surveyFormData.endTime.replace(/-/g, '/'), 'yyyy年MM月dd日'):'';

        const color = ["#FCD06A", "#FFAF59", "#FF7A26", "#FF7375"];
        return (
            <View className='survey-edit'>

                <AtTabs
                    current={this.state.currentTab}
                    swipeable={true}
                    tabList={[
                        { title: '调查结果' },
                        { title: '编辑' }
                    ]}
                    onClick={this.handleTabClick.bind(this)}>
                    <AtTabsPane current={this.state.currentTab} index={0}>
                        <View style='margin-top:0;background-color: #f5f5f5;'>
                            <View className='survey-result-head'>
                                <View className='survey-result-head-user'>
                                    <Dimage
                                        src={surveyResult.createByCover}
                                        type='avatar'
                                    />
                                    <View>
                                        发起调查者
                                        <Text className='survey-result-head-user-name'>{surveyResult.createByName}</Text>
                                    </View>
                                </View>
                                <View className='survey-result-head-title'>{surveyResult.title}</View>
                                <View className='survey-result-head-time'>{surveyResult.startTime.substring(0, 10)} ~ {surveyResult.endTime.substring(0, 10)}</View>
                            </View>

                            <View className='survey-result-data'>
                                <View className='survey-result-data-title'>调查总体情况</View>
                                <View className='at-row'>
                                    <View className='at-col at-col-3 survey-result-data-item'>
                                        <View><Text className='survey-result-data-item-num'>{surveyResult.joinNum}</Text>人</View>
                                        <View>参与人数</View>
                                    </View>
                                    <View className='at-col at-col-3 survey-result-data-item'>
                                        <View><Text className='survey-result-data-item-num'>{surveyResult.redTotal}</Text>元</View>
                                        <View>充值金额</View>
                                    </View>
                                    <View className='at-col at-col-3 survey-result-data-item'>
                                        <View><Text className='survey-result-data-item-num'>{surveyResult.redGetNum}</Text>个</View>
                                        <View>红包发放</View>
                                    </View>
                                    <View className='at-col at-col-3 survey-result-data-item'>
                                        <View><Text className='survey-result-data-item-num'>{Number(surveyResult.redTotal) - Number(surveyResult.redGetTotal)}</Text>元</View>
                                        <View>红包剩余</View>
                                    </View>
                                </View>
                            </View>

                            {
                                surveyResult.questions && surveyResult.questions.map((item, index) => (
                                    item.type != '2' ?
                                        (
                                            <View className='survey-result-item'>
                                                <View className='survey-result-item-head'>
                                                    <Text className='survey-result-item-head-type'>{item.type == '0' ? '单选' : '多选'}</Text>
                                                    <Text className='survey-result-item-head-title'>{index + 1}.{item.title}</Text>
                                                </View>
                                                {
                                                    item.answerList && item.answerList.map((questionItem, idx) => {
                                                        return <Block>
                                                            <View className='survey-result-item-option'>
                                                                <View>{questionItem.name}</View>
                                                                <View className='at-row'>
                                                                    <View className='at-col'>
                                                                        <AtProgress percent={Number(item.answerChooseNum) != 0 ? (Number(questionItem.chooseNum) / Number(item.answerChooseNum) * 100) : 0} color={color[idx % 4]} strokeWidth={10} />
                                                                    </View>
                                                                    <View className='survey-result-item-option-num'>{questionItem.chooseNum}票</View>
                                                                </View>
                                                            </View>
                                                            {
                                                                questionItem.type == '1' && <View className='survey-result-item-answer'>
                                                                    {
                                                                        questionItem.answerValueList && questionItem.answerValueList.map((answerItem, ansIdx) => (
                                                                            ansIdx < 3 && <View className='survey-result-item-answer-item'>{answerItem.value}</View>
                                                                        ))
                                                                    }
                                                                    {
                                                                        questionItem.answerValueList.length > 3 && <View className='survey-result-item-answer-more'>查看更多</View>
                                                                    }

                                                                </View>
                                                            }
                                                        </Block>
                                                    })
                                                }
                                            </View>
                                        ) : (
                                            <View className='survey-result-item'>
                                                <View className='survey-result-item-head'>
                                                    <Text className='survey-result-item-head-type'>问答</Text>
                                                    <Text className='survey-result-item-head-title'>{index + 1}.{item.title}</Text>
                                                </View>

                                                <View className='survey-result-item-answer'>
                                                    {
                                                        item.answerValueList && item.answerValueList.map((obj, idx) => (
                                                            idx < 3 && <View className='survey-result-item-answer-item'>{obj.value}</View>
                                                        ))
                                                    }
                                                    {
                                                        item.answerValueList.length > 3 && <View className='survey-result-item-answer-more'>查看更多</View>
                                                    }
                                                </View>
                                            </View>
                                        )
                                ))
                            }

                        </View>
                    </AtTabsPane>
                    <AtTabsPane current={this.state.currentTab} index={1}>
                        <View style='margin-top:0;background: #f5f5f5;'>
                            <View className='survey-edit-form'>
                                <View className='survey-edit-form-item-title'>活动名称</View>
                                <AtInput
                                    value={surveyFormData.title}
                                    onChange={this.handleTitleChange}
                                    placeholder='请输入活动名称'
                                    name='title'
                                    maxLength={255}
                                />

                                <View className='survey-edit-form-item-title'>活动说明</View>
                                <AtInput
                                    value={surveyFormData.content}
                                    onChange={this.handleContentChange}
                                    placeholder='请输入活动说明'
                                    name='content'
                                />

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>开始时间</View>
                                        <View className='survey-edit-form-item-date'>
                                            <Picker mode="date" value={surveyFormData.startTime} onChange={this.onDateChange.bind(this, 'start')} disabled={isBegin}>
                                                <View className="picker">
                                                    {startTimeFormat}
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                    <View className='at-col at-col-2'>
                                        <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                                    </View>
                                    <View className='at-col at-col-5'>
                                        <View>结束时间</View>
                                        <View className='survey-edit-form-item-date'>
                                            <Picker mode="date" value={surveyFormData.endTime} onChange={this.onDateChange.bind(this, 'end')} disabled={isEnd}>
                                                <View className="picker">
                                                    {endTimeFormat}
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5' style='line-height: 90rpx;'>
                                        <View>设置活动封面</View>
                                    </View>
                                    <View className='at-col at-col-6' onClick={this.chooseCover}>
                                        <Image
                                            src={process.env.apiBackImgPre + surveyFormData.cover}
                                            mode='aspectFit'
                                            onError={e => {
                                                console.warn("imgError", e);
                                            }}
                                            className='survey-edit-form-item-img'
                                        />
                                    </View>
                                    <View className='at-col at-col-1' style='line-height: 90rpx;'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>
                            </View>

                            <View className='survey-edit-form'>

                                <View className='at-row survey-edit-form-item' onClick={this.handleChooseStartOrg}>
                                    <View className='at-col at-col-5'>
                                        <View>发起组织</View>
                                    </View>
                                    <View className='at-col at-col-6'>
                                        <View className='survey-edit-form-item-content'>{checkedOrg.name}</View>
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>


                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>参与组织</View>
                                    </View>
                                    <View className="at-col at-col-6" onClick={this.handleChooseOrg}>
                                        <View className="survey-edit-form-item-content">
                                            {checkedOrgList.length}个组织
                                        </View>
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>参与人员</View>
                                    </View>
                                    <View className='at-col at-col-6' onClick={this.handleChooseUser}>
                                        <View className='survey-edit-form-item-content'>
                                            {
                                                checkedUserList && checkedUserList.map((item, index) => (
                                                    index < 3 && <Dimage src={item.avatar} type='avatar' />
                                                ))
                                            }
                                            等{checkedUserList.length}人
                                        </View>
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>群众可参与</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='survey-edit-form-item-content' style='padding-right: 32rpx;'>{surveyFormData.peopleJoin == 1 ? '是' : '否'}</View>
                                    </View>
                                </View>

                            </View>

                            <View className='survey-edit-form'>
                                <View className='at-row survey-edit-form-item'>
                                    <View>当前红包发放</View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View>微信红包重要提示</View>
                                </View>

                                <View className='survey-edit-form-item-intro'>
                                    <View>1.由于充值渠道为微信，所以参与者只能在微信终端上领取红包。</View>
                                    <View>2.由于微信平台需抽取千分之六手续费，所以实际充值金额会增加千分之六的费用。</View>
                                    <View>3.未发完的红包额，将在活动结束后1个工作日内原路退回。</View>
                                    <View>4.红包充值金额不可开具发票，请谨慎充值。</View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>当前红包数（个）</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='survey-edit-form-item-content-red' style='padding-right: 32rpx;'>
                                            <Text className="text-red">{surveyFormData.redGetNum}</Text>/{surveyFormData.redTotalNum}
                                        </View>
                                    </View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>单个红包金额（元）</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='survey-edit-form-item-content-red' style='padding-right: 32rpx;'>{surveyFormData.redMoney}</View>
                                    </View>
                                </View>

                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>支付金额合计（元）</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='survey-edit-form-item-content-red' style='padding-right: 32rpx;'>{surveyFormData.redPayTotal}</View>
                                    </View>
                                </View>
                            </View>

                            <View className='survey-edit-form'>
                                <View className='at-row survey-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>是否追加红包</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <AtSwitch border={false} value={redNeed == 1} onChange={this.redSwitchChage} disabled={isEnd} color='#ff574f'  />
                                    </View>
                                </View>
                                {
                                    redNeed && <Block>
                                        <View className='at-row survey-edit-form-item'>
                                            <View className='at-col at-col-5'>
                                                <View>追加红包数（个）</View>
                                            </View>
                                            <View className='at-col at-col-7 input-right'>
                                                <AtInput
                                                    name='value'
                                                    type='text'
                                                    value={redTotalNum}
                                                    onChange={this.redInputChange}
                                                />
                                            </View>
                                        </View>
                                        <View className='at-row survey-edit-form-item'>
                                            <View className='at-col at-col-5'>
                                                <View>支付金额合计（元）</View>
                                            </View>
                                            <View className='at-col at-col-7 input-right'>
                                                <AtInput
                                                    name='value'
                                                    type='text'
                                                    value={redPayTotal}
                                                    disabled={true}
                                                />
                                            </View>
                                        </View>
                                    </Block>
                                }

                                <View className='survey-edit-form-btn'>
                                    <AtButton type='primary' onClick={this.onSubmit}>保存</AtButton>
                                </View>
                            </View>
                        </View>
                    </AtTabsPane>
                </AtTabs>


            </View>
        )
    }
}

export default Edit
