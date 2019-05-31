import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Picker } from '@tarojs/components'
import { AtToast, AtTextarea, AtButton, AtIcon, AtSwitch } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { debounce } from '../../../../utils/common'
import { AnswerProps, AnswerState } from './index.interface'
import Validate from '../../../../utils/validate'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'

@connect(({ common, answer, orgPopView, userPopView }) => ({
    ...common,
    ...answer,
    checkedOrgList: orgPopView.checkedList,
    checkedUserList: userPopView.checkedList
}))

class Answer extends Component<AnswerProps, AnswerState> {
    config: Config = {
        navigationBarTitleText: '发布趣味答题'
    }
    constructor(props: AnswerProps) {
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
            answerFormData: {},
            filePath: '',
            checkedUserList: [],
            checkedOrgList: [],
            answerTitleActive: false,
            answerExplainActive: false
        }
    }

    componentDidMount() {

    }

    componentDidShow() {
        this.setState({
            checkedUserList: this.props.checkedUserList,
            checkedOrgList: this.props.checkedOrgList
        })
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

    handleFocus() {
        this.setState({
            answerTitleActive: !this.state.answerTitleActive
        });

        console.log(this.state.toast.isOpened);
    }

    handleFocusForExplain() {
        this.setState({
            answerExplainActive: !this.state.answerExplainActive
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
    chooseCover = debounce(e => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res);
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
                console.log(res);
                if (res.code == 1) {
                    this.setState({
                        filePath,
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
    handleChooseOrg = e => {
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        })
    }

    // 人员选择
    handleChooseUser = e => {
        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        })
    }

    // 群众
    onSwitchChange = e => {
        this.setState({
            answerFormData: {
                ...this.state.answerFormData,
                peopleJoin: e ? '1' : '0'
            }
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

    // 下一步
    handleNextStep = e => {
        const { answerFormData, checkedOrgList, checkedUserList } = this.state;
        const validate = new Validate();
        validate.data(answerFormData.title).isRequired('活动名称不能为空');
        validate.data(answerFormData.content).isRequired('活动说明不能为空');
        validate.data(answerFormData.startDate).isRequired('开始时间不能为空');
        validate.data(answerFormData.endDate).isRequired('结束时间不能为空').isAfterDate(answerFormData.startDate, '结束时间不能小于开始时间');
        validate.validateRule(checkedOrgList.length > 0 || checkedUserList.length > 0, '参与组织和参与人员不能同时为空');

        if( !validate.pass ) {
            this.setState({
                toast: {
                    ...this.state.toast,
                    isOpened: true,
                    text: validate.errorMessage
                }
            });
            return false;
        }

        let orgs: any = [];
        let users: any = [];
        checkedOrgList.forEach(element => {
            orgs.push({
                objectId:element.orgId,
                objectName:element.orgName
            })
        });
        checkedUserList.forEach(element => {
            users.push({
                objectAvatar: element.avatar,
                objectId: element.userId,
                objectName: element.userName
            })
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'answer/updateState',
            payload: {
                orgs: orgs,
                users: users,
                ...this.state.answerFormData
            }
        })
        Taro.navigateTo({
            url: '/subPackageEco/pages/answer/addAnswerForm/index'
        })

    }

    render() {
        const { answerFormData, filePath, checkedUserList, checkedOrgList, toast} = this.state;
        
        return (
            <View className='answer-create'>
                <AtToast isOpened={ toast.isOpened } text={ toast.text } icon={ toast.icon } status={ toast.status } 
                    duration={ toast.duration } onClose={ this.closeToast.bind(this) }></AtToast>

                <View className='answer-create-form'>

                    <View className={this.state.answerTitleActive ? 'answer-create-form-item-title-active' : 'answer-create-form-item-title'}>活动名称</View>
                    <AtTextarea
                        count={false}
                        value=''
                        height='36'
                        onChange={ this.handleChange.bind(this) }
                        onFocus={ this.handleFocus.bind(this) }
                        onBlur={ this.handleFocus.bind(this) }
                        maxLength={50}
                        placeholder='请输入活动名称'
                    />

                    <View className={this.state.answerExplainActive ? 'answer-create-form-item-title-active' : 'answer-create-form-item-title'}>活动说明</View>
                    <AtTextarea
                        count={false}
                        value=''
                        height='36'
                        onChange={this.handleExplainChange.bind(this)}
                        onFocus={this.handleFocusForExplain.bind(this)}
                        onBlur={this.handleFocusForExplain.bind(this)}
                        maxLength={50}
                        placeholder='请输入活动说明'
                    />

                    <View className='at-row answer-create-form-item'>
                        <View className='at-col at-col-5'>
                            <View>开始时间</View>
                            <View className='answer-create-form-item-date'>
                                <Picker value={ answerFormData.startDate } mode='date' onChange={ this.selectDate.bind(this, 'start') } >
                                    <View className='answer-create-form-item-date'>
                                        <View className={`picker ${answerFormData.startDate ? '' : 'gray'}`}>{answerFormData.startDate ? answerFormData.startDate : '请选择'}</View>
                                    </View>
                                </Picker>
                            </View>
                        </View>
                        <View className='at-col at-col-2'>
                            <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                        </View>
                        <View className='at-col at-col-5'>
                            <View>结束时间</View>
                            <View className='answer-create-form-item-date'>
                                <Picker value={answerFormData.endDate} mode='date' onChange={ this.selectDate.bind(this, 'end') }>
                                    <View className='answer-create-form-item-date'>
                                        <View className={`picker ${answerFormData.endDate ? '' : 'gray'}`}>{answerFormData.endDate ? answerFormData.endDate : '请选择'}</View>
                                    </View>
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View className='at-row answer-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 90rpx;'>
                            <View>设置活动封面</View>
                        </View>
                        <View className='at-col at-col-6' onClick={ this.chooseCover.bind(this) }>
                            <Image
                                src={ filePath }
                                mode='aspectFit'
                                onError={e => {
                                }}
                                className='answer-create-form-item-img'
                            />
                        </View>
                        <View className='at-col at-col-1' style='line-height: 90rpx;'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>
                </View>

                <View className='answer-create-form'>
                    <View className='at-row answer-create-form-item' onClick={ this.handleChooseOrg.bind(this) }>
                        <View className='at-col at-col-5'>
                            <View>参与组织</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                checkedOrgList.length > 0 && 
                                <View className='answer-create-form-item-content'>{ checkedOrgList.length }个组织</View>
                            }
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>

                    <View className='at-row answer-create-form-item' onClick={ this.handleChooseUser.bind(this) }>
                        <View className='at-col at-col-5'>
                            <View>参与人员</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                checkedUserList.length > 0 && 
                                <View className='answer-create-form-item-content'>
                                    { 
                                        checkedUserList.map((user, index) => {
                                            return (
                                                index < 3 && <Dimage
                                                    src={ user.avatar }
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

                    <View className='at-row answer-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>群众可参与</View>
                        </View>
                        <View className='at-col at-col-7'>
                            <AtSwitch onChange={ this.onSwitchChange.bind(this) } checked={ answerFormData.peopleJoin == '1' } border={ false } />
                        </View>
                    </View>

                    <View className='next-btn'>
                        <AtButton type='primary' onClick={ this.handleNextStep.bind(this) }>下一步</AtButton>
                    </View>
                </View>

            </View>
        )
    }
}

export default Answer
