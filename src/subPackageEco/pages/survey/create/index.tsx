import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Picker } from '@tarojs/components'
import { AtTextarea, AtButton, AtIcon, AtSwitch, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { IcreateSurveyProps, IcreateSurveyState } from './index.interface'
import './index.scss'
import Dimage from '../../../../pages/common/dimage'
// import {  } from '../../components'
const WeValidator = require('we-validator')

@connect(({ survey, activityOrg, activityUser, orgSinglePopView }) => ({
    ...survey,
    //checkedOrgList: orgPopView.checkedList,
    //checkedUserList: userPopView.checkedList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg
}))

class CreateSurvey extends Component<IcreateSurveyProps, IcreateSurveyState> {
    config: Config = {
        navigationBarTitleText: '发布调查活动'
    }
    constructor(props: IcreateSurveyProps) {
        super(props)
        this.state = {
            surveyFormData: {},
            checkedUserList: [],
            checkedOrgList: [],
            filePath: '',
            activityTitleActive: false,
            activityExplainActive: false
        }
    }
    validatorInstance: any

    componentDidMount() {
        this.initValidator();
    }
    componentDidShow() {
        this.setState({
            checkedUserList: this.props.checkedUserList,
            checkedOrgList: this.props.checkedOrgList
        })
    }
    componentWillUnmount() {
        console.log('卸载的时候:清除组织和人员选择');
        const { dispatch } = this.props;
        dispatch({
            type: 'popView/clear'
        });

        // 清除表单
        dispatch({
            type: 'survey/clear'
        })
    }
    // 标题与内容Change事件
    titleAndContentChange(type, e) {
        //const inputValue = e.detail.value;
        const inputValue = e;
        if (type === 'title') {
            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    title: inputValue
                }

            });
        } else if (type === 'content') {
            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    content: inputValue
                }
            })
        }
    }

    // 标题与内容FocusAndBlur事件
    titleAndContentFocusAndBlur(type, eType, e) {
        if (type === 'title') {
            this.setState({
                activityTitleActive: eType == 'focus' ? true : false
            })
        } else if (type === 'content') {
            this.setState({
                activityExplainActive: eType == 'focus' ? true : false
            })
        }

    }

    // 选择时间change
    selectDate(type, e) {
        // 'start' 开始日期； 'end'截止日期；
        const selectDateVal = e.detail.value;
        if (type == 'start') {
            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    startDate: selectDateVal
                }
            });
        } else {
            this.setState({
                surveyFormData: {
                    ...this.state.surveyFormData,
                    endDate: selectDateVal
                }
            });
        }

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
            formData: { businessName: 'survey' ,token:''}
        }).then(res => {
            console.log(res);
            //const { path } = res.data;
            this.setState({
                filePath: filepath,
                surveyFormData: {
                    ..._this.state.surveyFormData,
                    cover: JSON.parse(res.data).path,
                    coverId: JSON.parse(res.data).id
                }
            })
        })
        */

        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadSingleFile',
            payload: {
                filePath: filepath,
                businessName: 'survey'
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        filePath: filepath,
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
            surveyFormData: {
                ...this.state.surveyFormData,
                peopleJoin: e ? '1' : '0'
            }
        })
    }

    // 下一步
    handleNextStep = e => {
        this.setState({
            surveyFormData: {
                ...this.state.surveyFormData,
                orgId: this.props.checkedOrg.id,
                orgName: this.props.checkedOrg.name,
                orgCode: this.props.checkedOrg.code,
            }

        }, () => {
            if (!this.validatorInstance.checkData(this.state.surveyFormData)) return

            if (this.state.checkedOrgList.length <= 0 && this.state.checkedUserList.length <= 0) {
                Taro.showToast({
                    icon: 'none',
                    title: '请选择活动参与组织或活动参与人员'
                })
                return
            }

            const { checkedOrgList, checkedUserList } = this.state;
            let orgs: any = [];
            let users: any = [];
            checkedOrgList.forEach(element => {
                orgs.push({
                    objectId: element.orgId,
                    objectName: element.orgName
                })
            });
            checkedUserList.forEach(element => {
                users.push({
                    objectId: element.userId,
                    objectName: element.userName
                })
            });
            const { dispatch } = this.props;
            dispatch({
                type: 'survey/updateState',
                payload: {
                    orgs: orgs,
                    users: users,
                    ...this.state.surveyFormData
                }
            })
            Taro.navigateTo({
                url: '/subPackageEco/pages/survey/addSurveyForm/index'
            })
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
                startDate: {
                    required: true
                },
                endDate: {
                    required: true
                },
                cover: {
                    required: true
                },
                orgId: {
                    required: true
                }

            },
            messages: {
                title: {
                    required: '活动名称不能为空'
                },
                content: {
                    required: '活动内容不能为空'
                },
                startDate: {
                    required: '活动开始时间不能为空'
                },
                endDate: {
                    required: '活动结束时间不能为空'
                },
                cover: {
                    required: '活动封面不能为空'
                },
                orgId: {
                    required: '活动发起组织不能为空'
                }
            },
        })
    }


    render() {
        const { checkedUserList, checkedOrgList } = this.state;
        const { surveyFormData, filePath } = this.state;
        const { checkedOrg } = this.props;
        const peopleJoin = false;
        return (
            <View className='activity-create'>
                <View className='activity-create-form'>

                    <View className={this.state.activityTitleActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动名称</View>
                    <AtInput
                        value={surveyFormData.title}
                        onChange={this.titleAndContentChange.bind(this, 'title')}
                        placeholder='请输入活动名称'
                        name='title'
                        maxLength={255}
                        onFocus={this.titleAndContentFocusAndBlur.bind(this, 'title', 'focus')}
                        onBlur={this.titleAndContentFocusAndBlur.bind(this, 'title', 'blur')}
                    />

                    <View className={this.state.activityExplainActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动说明</View>
                    <AtInput
                        name='content'
                        value={surveyFormData.content}
                        onChange={this.titleAndContentChange.bind(this, 'content')}
                        placeholder='请输入活动说明'
                        onFocus={this.titleAndContentFocusAndBlur.bind(this, 'content', 'focus')}
                        onBlur={this.titleAndContentFocusAndBlur.bind(this, 'content', 'blur')}
                    />

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5'>
                            <View>开始时间</View>
                            <Picker value={surveyFormData.startDate} mode='date' onChange={this.selectDate.bind(this, 'start')}>
                                <View className='activity-create-form-item-date'>
                                    <View className={`picker ${surveyFormData.startDate ? '' : 'gray'}`}>{surveyFormData.startDate ? surveyFormData.startDate : '请选择'}</View>
                                </View>
                            </Picker>
                        </View>
                        <View className='at-col at-col-2'>
                            <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#E6E6E6'></AtIcon>
                        </View>
                        <View className='at-col at-col-5'>
                            <View>结束时间</View>
                            <Picker value={surveyFormData.endDate} mode='date' onChange={this.selectDate.bind(this, 'end')}>
                                <View className='activity-create-form-item-date'>
                                    <View className={`picker ${surveyFormData.endDate ? '' : 'gray'}`}>{surveyFormData.endDate ? surveyFormData.endDate : '请选择'}</View>
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
                                        console.warn("imgError", e);
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
                            <View className='activity-create-form-item-content'>{checkedOrg.name ? checkedOrg.name : '请选择'}</View>
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



                    <View className='at-row activity-create-form-item' >
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

export default CreateSurvey
