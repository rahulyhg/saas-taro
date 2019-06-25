
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Picker } from '@tarojs/components'
import { AtButton, AtIcon, AtSwitch, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { ActivityProps, ActivityState } from './index.interface'
import './index.scss'
// import {  } from '../../components'
import Dimage from '../../../../pages/common/dimage'
//import _lodash from 'underscore'
const WeValidator = require('we-validator')

@connect(({ activity, activityOrg, activityUser, orgSinglePopView }) => ({
    ...activity,
    // checkedOrgList: orgPopView.checkedList,
    // checkedUserList: userPopView.checkedList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg
}))
class Activity extends Component<ActivityProps, ActivityState> {
    config: Config = {
        navigationBarTitleText: '发布报名活动'
    }
    constructor(props: ActivityProps) {
        super(props)
        this.state = {
            activityTitleActive: false,
            activityExplainActive: false,
            activityFormData: {},
            checkedUserList: [],
            checkedOrgList: [],
            filePath: ''
        }
    }

    validatorInstance: any

    componentDidMount() {
        //console.error(this.props)

        // 数组长度校验
        /*
        WeValidator.addRule('arrayRequired', {
            rule:function (value, param) {
                console.error("数组校验：", value)
                return (value.length > 0)
            }
        })
        */

        this.initValidator();
    }


    componentWillUnmount() {
        console.log('卸载的时候:清除组织和人员选择');
        const { dispatch } = this.props;
        dispatch({
            type: 'popView/clear'
        });
        dispatch({
            type: 'addActForm/clear'
        });

    }
    componentDidShow() {
        this.setState({
            checkedUserList: this.props.checkedUserList,
            checkedOrgList: this.props.checkedOrgList
        })
    }


    onReset(event) {
        console.log(event)
    }
    // 标题
    handleTitleChange = e => {
        this.setState({

            activityFormData: {
                ...this.state.activityFormData,
                //title: e.detail.value
                title: e
            }
        })
    }

    handleTitleFocus = e => {
        this.setState({
            activityTitleActive: true
        })
    }
    handleTitleBlur = e => {
        this.setState({
            activityTitleActive: false
        })
    }
    // 内容
    handleContentChange = e => {
        this.setState({
            activityFormData: {
                ...this.state.activityFormData,
                //content: e.detail.value
                content: e
            }
        })
    }

    handleContentFocus = e => {
        this.setState({
            activityExplainActive: true
        })
    }
    handleContentBlur = e => {
        this.setState({
            activityExplainActive: false
        })
    }

    // 日期选择
    onDateChange = (type, e) => {
        if (type === 'start') {
            this.setState({
                activityFormData: {
                    ...this.state.activityFormData,
                    startTime: e.detail.value
                }
            })
        } else {
            this.setState({
                activityFormData: {
                    ...this.state.activityFormData,
                    endTime: e.detail.value
                }
            })
        }
        console.log(type, e)
    }

    // 发起组织
    handleChooseStartOrg = e => {
        Taro.navigateTo({
            url: '/pages/common/orgSinglePopView/orgSinglePopView'
        })
    }

    // 组织选择
    handleChooseOrg = e => {
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

    // 群众
    onSwitchChange = e => {
        this.setState({
            activityFormData: {
                ...this.state.activityFormData,
                peopleJoin: e ? '1' : '0'
            }
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
                filePath: filepath,
                activityFormData: {
                    ..._this.state.activityFormData,
                    cover: JSON.parse(res.data).path
                }
            })
        })
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
                        filePath: filepath,
                        activityFormData: {
                            ..._this.state.activityFormData,
                            cover: res.data.path,
                            coverId: res.data.id
                        }
                    });
                }
            }
        });
    }

    // 下一步
    handleNextStep = e => {
        let params = {
            launchOrg: {
                id: this.props.checkedOrg.id,
                name: this.props.checkedOrg.name,
                code: this.props.checkedOrg.code,
            },
            joinOrg: this.state.checkedOrgList,
            joinUser: this.state.checkedUserList,
            ...this.state.activityFormData
        };

        if (_lodash.isEmpty(params.peopleJoin)) {
            params.peopleJoin = '0'
        }

        if (!this.validatorInstance.checkData(params)) return
        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                icon: 'none',
                title: '活动发起组织不能为空'
            })
            return
        }

        if (this.state.checkedOrgList.length <= 0 && this.state.checkedUserList.length <= 0) {
            Taro.showToast({
                icon: 'none',
                title: '请选择活动参与组织或活动参与人员'
            })
            return
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'activity/updateState',
            payload: params
        })
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/addActForm/index'
        })

    }

    initValidator() {
        // 实例化
        this.validatorInstance = new WeValidator({
            rules: {
                title: {
                    required: true
                },
                content: {
                    required: true
                },
                startTime: {
                    required: true
                },
                endTime: {
                    required: true
                },
                cover: {
                    required: true
                },
                joinOrg: {
                    arrayRequired: true
                },
                joinUser: {
                    arrayRequired: true
                }

            },
            messages: {
                title: {
                    required: '活动名称不能为空'
                },
                content: {
                    required: '活动内容不能为空'
                },
                startTime: {
                    required: '活动开始时间不能为空'
                },
                endTime: {
                    required: '活动结束时间不能为空'
                },
                cover: {
                    required: '活动封面不能为空'
                },
                joinOrg: {
                    arrayRequired: '活动参与组织不能为空'
                },
                joinUser: {
                    arrayRequired: '活动参与人员不能为空'
                }
            },
        })
    }


    render() {
        const { checkedUserList, checkedOrgList, filePath } = this.state;
        const { checkedOrg } = this.props;
        const { activityFormData } = this.state;
        const peopleJoin = activityFormData.peopleJoin == '1';
        console.error(activityFormData);
        return (
            <View className='activity-create'>
                <View className='activity-create-form'>

                    <View className={this.state.activityTitleActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动名称</View>
                    <AtInput
                        onChange={this.handleTitleChange.bind(this)}
                        name='title'
                        placeholder='请输入活动名称'
                        value={activityFormData.title}
                        maxLength={255}
                        onFocus={this.handleTitleFocus}
                        onBlur={this.handleTitleBlur}
                    />

                    <View className={this.state.activityExplainActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动说明</View>
                    <AtInput
                        name='content'
                        onChange={this.handleContentChange.bind(this)}
                        maxLength={255}
                        placeholder='请输入活动说明'
                        value={activityFormData.content}
                        onFocus={this.handleContentFocus}
                        onBlur={this.handleContentBlur}
                    />

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5'>
                            <Picker mode='date' value={activityFormData.startTime} onChange={this.onDateChange.bind(this, 'start')}>
                                <View>开始时间</View>
                                <View className='activity-create-form-item-date'>
                                    <View className={`picker ${activityFormData.startTime ? '' : 'gray'}`}>
                                        {activityFormData.startTime?activityFormData.startTime:'请选择'}
                                    </View>
                                </View>
                            </Picker>
                        </View>

                        <View className='at-col at-col-2'>
                            <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                        </View>
                        <View className='at-col at-col-5'>
                            <Picker mode='date' value={activityFormData.endTime} onChange={this.onDateChange.bind(this, 'end')}>
                                <View>结束时间</View>
                                <View className='activity-create-form-item-date'>
                                    <View className={`picker ${activityFormData.endTime ? '' : 'gray'}`}>
                                        {activityFormData.endTime?activityFormData.endTime:'请选择'}
                                    </View>
                                </View>
                            </Picker>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 90rpx;'>
                            <View>设置活动封面</View>
                        </View>
                        <View className='at-col at-col-6' onClick={this.chooseCover}>
                            

                            {
                                filePath ? <Image
                                    src={filePath}
                                    mode='aspectFit'
                                    onError={e => {
                                    }}
                                    className='activity-create-form-item-img'
                                /> : <View className='mindView'>请选择封面</View>
                            }



                        </View>
                        <View className='at-col at-col-1' style='line-height: 90rpx;'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>
                </View>

                <View className='activity-create-form'>
                    <View className='at-row activity-create-form-item' onClick={this.handleChooseStartOrg}>
                        <View className='at-col at-col-5'>
                            <View>发起组织</View>
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='activity-create-form-item-content'>{checkedOrg.name?checkedOrg.name:'请选择'}</View>
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item' onClick={this.handleChooseOrg}>
                        <View className='at-col at-col-5'>
                            <View>参与组织</View>
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='activity-create-form-item-content'>{checkedOrgList.length}个组织</View>
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item' onClick={this.handleChooseUser}>
                        <View className='at-col at-col-5'>
                            <View>参与人员</View>
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='activity-create-form-item-content'>
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

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>群众可参与</View>
                        </View>
                        <View className='at-col at-col-7'>
                            <AtSwitch onChange={this.onSwitchChange} checked={peopleJoin} border={false} color='#ff574f' />
                        </View>
                    </View>

                    <View className='next-btn'>
                        <AtButton type='primary' onClick={this.handleNextStep}>下一步</AtButton>
                    </View>
                </View>
            </View>
        )
    }
}

export default Activity
