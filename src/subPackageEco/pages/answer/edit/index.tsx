import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Picker, Block } from '@tarojs/components'
import { AtInput, AtToast, AtTextarea, AtButton, AtIcon, AtSwitch, AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { debounce, formatDate, globalData } from '../../../../utils/common'
import { EditProps, EditState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'
const apiBackImgPre = process.env.apiBackImgPre;

@connect(({ answer, activityOrg, activityUser, orgSinglePopView }) => ({
    ...answer,
    oldCheckedOrgList: activityOrg.oldCheckedOrgList,
    oldCheckedUserList: activityUser.oldCheckedUserList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg
}))

class Edit extends Component<EditProps,EditState > {
    config:Config = {
        navigationBarTitleText: '趣味答题详情'
    }
    constructor(props: EditProps) {
        super(props)
        this.state = {
            toast: {
                text: '',
                isOpened: false,
                duration: 2000,
                hasMask: false,
                icon: 'close-circle',
                status: 'error'
            },
            checkedOrgList: [],
            checkedUserList: [],
            checkedOrg: {},
            redNeed: 0,
            answerFormData: {},
            currentTab: 0,
            rateColorArr: ['#FCD06A','#FFAF59','#FF7A26']
        }
    }

    componentDidMount() {
        this.initData()
    }

    componentDidShow() {
        this.setState({
            checkedOrgList: this.props.checkedOrgList,
            checkedUserList: this.props.checkedUserList,
            checkedOrg: this.props.checkedOrg
        })
    }

    handleTabClick(val) {
        this.setState({
            currentTab: val
        }, () => {
            this.initData();
        });
    }

    initData = async () => {
        const { dispatch } = this.props;
        if (this.state.currentTab == 0) {
            await dispatch({
                type: 'answer/answerResult',
                payload: { id: this.$router.params.id }
            })
        } else {
            await dispatch({
                type: 'answer/answerDetail',
                payload: { id: this.$router.params.id }
            })

            let tempOrgs: any = [];
            let tempUsers: any = [];
            this.props.answerFormData.orgs.map(element => {
                tempOrgs.push({
                    orgId: element.objectId,
                    orgName: element.objectName
                })
            });
            this.props.answerFormData.users.map(element => {
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

            const {orgCode,orgId,orgName} = this.props.answerFormData;
            const launchOrg = { 
                code: orgCode, 
                id: orgId, 
                name: orgName 
            }
            dispatch({
                type: 'orgSinglePopView/updateState',
                payload: {
                    checkedOrg: launchOrg
                }
            })

            this.setState({
                checkedOrgList: tempOrgs,
                checkedUserList: tempUsers,
                checkedOrg: launchOrg,
                answerFormData: {
                    ...this.props.answerFormData
                }
            })
        }
    }

    handleChange(val) {
        this.setState({
            answerFormData: {
                ...this.state.answerFormData,
                title: val.detail.value
            }
        });
    }

    handleExplainChange(val) {
        this.setState({
            answerFormData: {
                ...this.state.answerFormData,
                content: val.detail.value
            }
        });
    }

    // 选择时间change
    selectDate(type, e) {
        // 'start' 开始日期； 'end'截止日期；
        const selectDateVal = e.detail.value;
        if (type == 'start') {
            this.setState({
                answerFormData: {
                    ...this.state.answerFormData,
                    startDate: selectDateVal
                }
            });
        } else {
            this.setState({
                answerFormData: {
                    ...this.state.answerFormData,
                    endDate: selectDateVal
                }
            });
        }
    }

    // 设置封面
    chooseCover = debounce(() => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {
                let filepath = res && res.tempFilePaths[0];
                
                _this.uploadFile(filepath);
            }
        })
    }, 300)

    uploadFile(filePath: string) {
        let _this = this;
        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadSingleFile',
            payload: {
                filePath,
                businessName: 'answer'
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        answerFormData: {
                            ..._this.state.answerFormData,
                            cover: res.data.path,
                            coverId: res.data.id
                        }
                    });
                }
            }
        });
    }

    // 组织选择
    handleChooseOrg = () => {
        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                title: '请先选择发起组织',
                duration: 2000,
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index?orgId=' + this.props.checkedOrg.id
        })
    }

    // 人员选择
    handleChooseUser = () => {
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

    closeToast() {
        this.setState({
            toast: {
                ...this.state.toast,
                isOpened: false
            }
        });
    }

    redSwitchChage = e => {
        this.setState({
            redNeed: e ? 1 : 0,
            redTotalNum: e ? this.state.redTotalNum : 0,
            redPayTotal: e ? this.state.redPayTotal : 0
        })
    }

    onSubmit = debounce(() => {
        const { dispatch, oldCheckedOrgList, oldCheckedUserList } = this.props;
        const { checkedOrgList, checkedUserList } = this.state;
        let orgs: any = [];
        let users: any = [];
        checkedOrgList && checkedOrgList.forEach(element => {
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
        checkedUserList && checkedUserList.forEach(element => {
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
            startDate,
            endDate,
            cover,
            coverId,
        } = this.state.answerFormData;
        const { redNeed } = this.state;
        let payload = {};
        if (redNeed == 1) {
            payload = {
                id,
                title,
                content,
                startDate: startDate.substring(0, 10),
                endDate: endDate.substring(0, 10),
                orgs,
                users,
                cover,
                coverId,
                redNeed,
                redPayTotal: this.state.redPayTotal,
                redTotalNum: this.state.redTotalNum,
            }
        } else {
            payload = {
                id,
                title,
                content,
                startDate: startDate.substring(0, 10),
                endDate: endDate.substring(0, 10),
                orgs,
                users,
                cover,
                coverId,
                redNeed,
            }
        }

        dispatch({
            type: 'answer/editAnswer',
            payload: {
                ...payload
            },
            callback: res => {
                if(res.code == 1) {
                    Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                        Taro.showToast({
                            title: '编辑成功',
                            icon: 'success',
                            duration: 2000
                        });
                    });
                } else {
                    Taro.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
                
            }
        })
    }, 300)

    onDelete = debounce(() => {
        Taro.showModal({
            title: '提示',
            content: '确定删除该活动？',
            success: res => {
                if( res.confirm ) {
                    const { id } = this.state.answerFormData;
                    const { dispatch } = this.props;
                    dispatch({
                        type: 'answer/deleteAnswer',
                        payload: { id, name: '111' },
                        callback: res => {
                            if (res.code == 1) {
                                Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                                    Taro.showToast({
                                        title: '删除成功',
                                        icon: 'success',
                                        duration: 2000
                                    });
                                });

                                Taro.navigateBack({ delta: 1 });
                            }
                        }
                    });
                }
            }
          });
        
    }, 300)

    render() {
        const { answerResult, checkedOrgList, checkedUserList, checkedOrg } = this.props;
        const { rateColorArr, answerFormData, redNeed, toast } = this.state;
        return (
            <View className='answer-edit'>
                <AtToast isOpened={ toast.isOpened } text={ toast.text } icon={ toast.icon } status={ toast.status } 
                    duration={ toast.duration } onClose={ this.closeToast.bind(this) }></AtToast>
                <AtTabs
                current={this.state.currentTab}
                swipeable={true}
                tabList={[
                    { title: '答题结果' },
                    { title: '编辑' }
                ]}
                onClick={this.handleTabClick.bind(this)}>
                    <AtTabsPane current={this.state.currentTab} index={0}>
                        <View style='background-color: #f5f5f5;'>
                            <View className='answer-result-head'>
                                <View className='answer-result-head-user'>
                                    <Dimage
                                        src={apiBackImgPre + answerResult.createByCover}
                                        mode='aspectFit'
                                        type='avatar'
                                        styleValue='height: 80rpx;width: 80rpx;border-radius: 50%;margin-right: 32rpx;'
                                    />
                                    <View>
                                        发起答题者
                                        <Text className='answer-result-head-user-name'>{ answerResult.createByName }</Text>
                                    </View>
                                </View>
                                <View className='answer-result-head-title'>{ answerResult.title }</View>
                                <View className='answer-result-head-time'>
                                    { formatDate(answerResult.startDate, globalData.commonShortDateFormatStr) } ~ 
                                    { formatDate(answerResult.endDate, globalData.commonShortDateFormatStr) }
                                </View>
                            </View>

                            <View className='answer-result-data'>
                                <View className='answer-result-data-title'>答题总体情况</View>
                                <View className='at-row'>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.joinNum }</Text>人</View>
                                        <View>参与人数</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.numAllRight }</Text>人</View>
                                        <View>全部答对</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.numAllErr }</Text>人</View>
                                        <View>全部答错</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.numOther }</Text>人</View>
                                        <View>其他</View>
                                    </View>
                                </View>
                                <View className='at-row'>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.redTotal ? answerResult.redTotal : 0 }</Text>元</View>
                                        <View>充值合计</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.redGetNum }</Text>个</View>
                                        <View>已发红包</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.redTotal - answerResult.redGetTotal }</Text>元</View>
                                        <View>未发红包</View>
                                    </View>
                                    <View className='at-col at-col-3 answer-result-data-item'>
                                        <View><Text className='answer-result-data-item-num'>{ answerResult.redGetNum }</Text>个</View>
                                        <View>已发人数</View>
                                    </View>
                                </View>
                            </View>

                            {
                                answerResult.questions.map((question, index) => {
                                    return (
                                        <View className='answer-result-item'>
                                            <View className='answer-result-item-head'>
                                                <Text className='answer-result-item-head-type'>{ question.type == 0 ? '单选' : '多选' }</Text>
                                                <Text className='answer-result-item-head-title'>{ index + 1 }.{ question.title }</Text>
                                            </View>
                                            {
                                                question.answerList.map((option, index) => {
                                                    return (
                                                        <View className='answer-result-item-option'>
                                                            <View>{ option.name }</View>
                                                            <View className='answer-result-item-option-content'>
                                                                <View className='answer-result-item-option-chartcontent'>
                                                                    <View className='answer-result-item-option-chart' style={'background-color:'+ rateColorArr[index % 3] +';' + 'width:' + option.chooseRate + '%'}></View>
                                                                    <View className='answer-result-item-option-rate'>{ option.chooseRate }%</View>
                                                                </View>
                                                                <View className='answer-result-item-option-num'>{ option.chooseNum } 票</View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })
                            }

                        </View>
                    </AtTabsPane>
                    <AtTabsPane current={this.state.currentTab} index={1}>
                        <View style='background: #f5f5f5;'>
                            <View className='answer-edit-form'>
                                <View className='answer-edit-form-item-title'>活动名称</View>
                                <AtTextarea
                                    count={false}
                                    value={ answerFormData.title }
                                    height='36'
                                    onChange={this.handleChange.bind(this)}
                                    maxLength={50}
                                    placeholder='请输入活动名称'
                                />

                                <View className='answer-edit-form-item-title'>活动说明</View>
                                <AtTextarea
                                    count={false}
                                    value={ answerFormData.content }
                                    height='36'
                                    onChange={this.handleExplainChange.bind(this)}
                                    maxLength={50}
                                    placeholder='请输入活动说明'
                                />

                                <View className='at-row answer-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>开始时间</View>
                                        <View className='answer-edit-form-item-date'>
                                            <Picker value={ answerFormData.startDate } mode='date' onChange={ this.selectDate.bind(this, 'start') } >
                                                <View className='answer-create-form-item-date'>
                                                    <View className={`picker ${ answerFormData.startDate ? '' : 'gray'}`}>
                                                        { answerFormData.startDate ? formatDate(answerFormData.startDate, globalData.commonShortDateFormatStr) : '请选择'}
                                                    </View>
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                    <View className='at-col at-col-2'>
                                        <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                                    </View>
                                    <View className='at-col at-col-5'>
                                        <View>结束时间</View>
                                        <View className='answer-edit-form-item-date'>
                                            <Picker value={ answerFormData.endDate } mode='date' onChange={ this.selectDate.bind(this, 'end') }>
                                                <View className='answer-create-form-item-date'>
                                                    <View className={`picker ${answerFormData.endDate ? '' : 'gray'}`}>
                                                        { answerFormData.endDate ? formatDate(answerFormData.endDate, globalData.commonShortDateFormatStr) : '请选择'}
                                                    </View>
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <View className='at-row answer-edit-form-item'>
                                    <View className='at-col at-col-5' style='line-height: 90rpx;'>
                                        <View>设置活动封面</View>
                                    </View>
                                    <View className='at-col at-col-6' onClick={this.chooseCover}>
                                        <Image
                                            src={ apiBackImgPre + answerFormData.cover }
                                            mode='aspectFit'
                                            onError={e => {
                                            }}
                                            className='answer-edit-form-item-img'
                                        />
                                    </View>
                                    <View className='at-col at-col-1' style='line-height: 90rpx;'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>
                            </View>

                            <View className='answer-edit-form'>
                                <View className='at-row answer-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>发起组织</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='answer-edit-form-item-content' style='padding-right: 32rpx;'>{ checkedOrg.name }</View>
                                    </View>
                                </View>
                                <View className='at-row answer-edit-form-item' onClick={ this.handleChooseOrg.bind(this) }>
                                    <View className='at-col at-col-5'>
                                        <View>参与组织</View>
                                    </View>
                                    <View className='at-col at-col-6'>
                                        {
                                            checkedOrgList.length > 0 && 
                                            <View className='answer-edit-form-item-content'>{ checkedOrgList.length }个组织</View>
                                        }
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='at-row answer-edit-form-item' onClick={ this.handleChooseUser.bind(this) }>
                                    <View className='at-col at-col-5'>
                                        <View>参与人员</View>
                                    </View>
                                    <View className='at-col at-col-6'>
                                        {
                                            checkedUserList.length > 0 && 
                                            <View className='answer-edit-form-item-content'>
                                                { 
                                                    checkedUserList.map((user, index) => {
                                                        return (
                                                            index < 3 && <Dimage
                                                                src={ apiBackImgPre + user.avatar }
                                                                mode='aspectFit'
                                                                type='avatar'
                                                                styleValue='height: 52rpx;width: 52rpx;border-radius: 50%;vertical-align:middle;margin-right: 4rpx;'
                                                            />
                                                        )
                                                    })
                                                }
                                                { checkedUserList.length > 3 ? '等' : '' }{ checkedUserList.length }人
                                            </View>
                                        }
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='at-row answer-edit-form-item'>
                                    <View className='at-col at-col-5'>
                                        <View>群众可参与</View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='answer-edit-form-item-content' style='padding-right: 32rpx;'>
                                            { answerFormData.peopleJoin == 1 ? '是' : '否' }
                                        </View>
                                    </View>
                                </View>

                            </View>

                            {
                                answerFormData.redNeed && 
                                <View className='answer-edit-form'>
                                    <View className='at-row answer-edit-form-item'>
                                        <View>当前红包发放</View>
                                    </View>

                                    <View className='at-row answer-edit-form-item'>
                                        <View>微信红包重要提示</View>
                                    </View>

                                    <View className='answer-edit-form-item-intro'>
                                        <View>1.由于充值渠道为微信，所以参与者只能在微信终端上领取红包。</View>
                                        <View>2.由于微信平台需抽取千分之六手续费，所以实际充值金额会增加千分之六的费用。</View>
                                        <View>3.未发完的红包额，将在活动结束后1个工作日内原路退回。</View>
                                        <View>4.红包充值金额不可开具发票，请谨慎充值。</View>
                                    </View>

                                    <View className='at-row answer-edit-form-item'>
                                        <View className='at-col at-col-5'>
                                            <View>当前红包数（个）</View>
                                        </View>
                                        <View className='at-col at-col-7'>
                                            <View className='answer-edit-form-item-content-red' style='padding-right: 32rpx;'>
                                                <Text className="text-red">18</Text>/100
                                            </View>
                                        </View>
                                    </View>

                                    <View className='at-row answer-edit-form-item'>
                                        <View className='at-col at-col-5'>
                                            <View>单个红包金额（元）</View>
                                        </View>
                                        <View className='at-col at-col-7'>
                                            <View className='answer-edit-form-item-content-red' style='padding-right: 32rpx;'>10</View>
                                        </View>
                                    </View>

                                    <View className='at-row answer-edit-form-item'>
                                        <View className='at-col at-col-5'>
                                            <View>支付金额合计（元）</View>
                                        </View>
                                        <View className='at-col at-col-7'>
                                            <View className='answer-edit-form-item-content-red' style='padding-right: 32rpx;'>1006</View>
                                        </View>
                                    </View>
                                </View>
                            }
                            

                            <View className='answer-edit-form'>
                                
                                {
                                    answerFormData.redNeed && 
                                    <Block>
                                        <View className='at-row answer-edit-form-item'>
                                            <View className='at-col at-col-5'>
                                                <View>是否追加红包</View>
                                            </View>
                                            <View className='at-col at-col-7'>
                                                <AtSwitch border={false} value={ redNeed == 1 } onChange={ this.redSwitchChage.bind(this) } />
                                            </View>
                                        </View>
                                        
                                        {
                                            redNeed && 
                                            <Block>
                                                <View className='at-row answer-edit-form-item'>
                                                    <View className='at-col at-col-5'>
                                                        <View>追加红包数（个）</View>
                                                    </View>
                                                    <View className='at-col at-col-7'>
                                                        <AtInput
                                                            name='value'
                                                            type='text'
                                                            value=""
                                                            onChange={this.handleChange.bind(this)}
                                                        />
                                                    </View>
                                                </View>

                                                <View className='at-row answer-edit-form-item'>
                                                    <View className='at-col at-col-5'>
                                                        <View>支付金额合计（元）</View>
                                                    </View>
                                                    <View className='at-col at-col-7'>
                                                        <AtInput
                                                            name='value'
                                                            type='text'
                                                            value=""
                                                            onChange={this.handleChange.bind(this)}
                                                        />
                                                    </View>
                                                </View>
                                            </Block>
                                        }
                                    </Block>
                                }

                                <View className='answer-edit-form-btn'>
                                    <AtButton type='primary' onClick={ this.onSubmit.bind(this) }>保存</AtButton>

                                    <AtButton type='secondary' className='answer-edit-form-btn-del' 
                                        onClick={ this.onDelete.bind(this) }>删除</AtButton>
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
