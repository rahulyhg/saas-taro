import Taro, { Component, Config } from '@tarojs/taro'
import { Block, View, Picker, Image, Input, Switch, Canvas } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtButton, AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { RewardsPunishmentsEditProps, RewardsPunishmentsEditState } from './index.interface'
import Djimage from '../../../../pages/common/dimage'
import { debounce, formatDate } from '@/src/utils/common'

const remoteImgPreUrl = process.env.remoteImgPreUrl
const imgChecked = remoteImgPreUrl + 'images/checked.png'

import './index.scss'
import Other from '../../appraise/other';

@connect(({ rewardsPunishmentsList, orgSinglePopView, userPopView, loading }) => ({
    ...rewardsPunishmentsList,
    checkedOrg: orgSinglePopView.checkedOrg,
    checkedUsers: userPopView.checkedList,
    loading,
}))
class RewardsPunishmentsDetail extends Component<RewardsPunishmentsEditProps, RewardsPunishmentsEditState> {
    config:Config = {
        navigationBarTitleText: '奖惩管理'
    }

    constructor(props: RewardsPunishmentsEditProps) {
        super(props)
        this.state = {
            type: [ 
                {
                    id: 0,
                    title: '组织荣誉',
                    index: 0,
                    type: 0
                }, 
                {
                    id: 1,
                    title: '组织惩处',
                    index: 1,
                    type: 0
                }, 
                {
                    id: 2,
                    title: '个人荣誉',
                    index: 0,
                    type: 1
                }, 
                {
                    id: 3,
                    title: '个人惩处',
                    index: 1,
                    type: 1
                }
            ],
            model: [
            ],

            checkedTypeIndex: 0,
            checkedModelIndex: 0,
            checkedType: {},
            checkedModel: {},
            name: '',
            sendTime: formatDate(new Date(), 'yyyy-MM-dd'),
            checkedOrg: null,
            checkedUsers: null,
            files: [],
            showFiles: [],
        }
    }
    
    componentDidMount() {
        const { type } = this.state
        this.setState({
            checkedType: type[0]
        })
        this.getSysDictListByTypeCode()
    }

    componentDidShow() {
        const { checkedOrg, checkedUsers } = this.props
        this.setState({
            checkedOrg,
            checkedUsers,
        })
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'popView/clear'
        });
    }
    
    getSysDictListByTypeCode = () => {
        const { dispatch } = this.props;
        /** 查询数据字典时值经过了转换，所以这边重新用0123转换回来 */
        const dic = [
            {
                id: 0,
                code: 'organize_reward_honor'
            }, 
            {
                id: 1,
                code: 'organize_reward_punish'
            },
            {
                id: 2,
                code: 'personal_reward_honor'
            },
            {
                id: 3,
                code: 'personal_reward_punish'
            }
        ]
        dispatch({
            type: 'rewardsPunishmentsList/getSysDictListByTypeCode',
            payload: {},
            callback: ((res:Array<any>[]) => {
                const findErrorIndex = res.findIndex((item:any) => {
                    item.code != 1
                })
                if(findErrorIndex > -1) {
                    Taro.showToast({
                        title: `获取奖惩类型失败${findErrorIndex}`
                    })
                    return
                }
                let model:any = {}
                res.map((item:any, index) => {
                    if(item.data) {
                        model = {...model, ...{
                            [`${index}`]: item.data
                        }}
                    }
                })
                console.warn(model)
                this.setState({
                    model,
                    checkedModel: model[0][0]
                })
            })
        });
    }

    onChangeName = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    /** 奖惩类别与类型 联动 开始 */
    onChangeType = (e:any) => {
        const { type, checkedModelIndex } = this.state
        const checkedTypeIndex = Number(e.detail.value)
        const checkedType = type[checkedTypeIndex]

        this.setState({
            checkedTypeIndex,
            checkedType,
        })
        this.setCheckedModel(checkedModelIndex, checkedTypeIndex)
    }

    onChangeModel = (e:any) => {
        const { checkedTypeIndex } = this.state
        const checkedModelIndex = Number(e.detail.value)
        this.setCheckedModel(checkedModelIndex, checkedTypeIndex)
    }

    setCheckedModel = (checkedModelIndex, checkedTypeIndex) => {
        const { model } = this.state
        const checkedModel = model[checkedTypeIndex][checkedModelIndex]

        this.setState({
            checkedModelIndex,
            checkedModel,
        })
    }
    /** 奖惩类别与类型 联动 结束 */

    onChangeSendTime = (e:any) => {
        this.setState({
            sendTime: e.detail.value
        })
    }

    onChooseSingleOrg = (e) => {
        Taro.navigateTo({
            url: '/pages/common/orgSinglePopView/orgSinglePopView'
        })
    }

    onChooseUsers = (e) => {
        Taro.navigateTo({
            url: '/pages/common/userPopView/userPopView?partyUserState=0'
        })
    }

    onChanageFile = (uploadFiles, operationType: 'add' | 'remove', index) => {
        const { dispatch } = this.props
        const { files, showFiles } = this.state

        const newUploadFiles = [...uploadFiles]
        newUploadFiles.map(file => {
            file['fileType'] = 'image'
        })

        if(operationType === 'add') {
            if((showFiles || []).length > 1) {
                Taro.showToast({
                    title: '只能上传一张图片',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            dispatch({
                type: 'common/uploadMultiFile',
                payload: {
                    fileArr: newUploadFiles,
                    businessName: 'rewardsImg',
                },
                callback: res => {
                    const { code, data } = res
                    if (code == 1) {
                        const newFiles = [...files || [], ...data]
                        const newShowFiles = [...showFiles || [], ...newUploadFiles]
    
                        this.setState({
                            files: newFiles,
                            showFiles: newShowFiles,
                        });
                    }
                }
            })
        } else {
            const newFiles = files || []
            newFiles.splice(index, 1)
            const newShowFiles = showFiles || []
            newShowFiles.splice(index, 1)

            this.setState({
                files: newFiles,
                showFiles: newShowFiles,
            })
        }
    }

    onSubmitForm = debounce((e:Event) => {
        e.stopPropagation()

        const { dispatch } = this.props
        const { files, checkedType, checkedModel, name, checkedOrg, checkedUsers, sendTime } = this.state
        let canSubmit
        let errMsg = ''
        const type = checkedType.type
        const genre = checkedType.id

        if((name || '').trim() === '') {
            errMsg = '请填写奖惩名称'
            canSubmit = false
        } else if(type === 0 && !(checkedOrg || {}).id) {
            errMsg = '请选择获奖组织'
            canSubmit = false
        } else if(type === 1 && (checkedUsers || []).length === 0) {
            errMsg = '请选择获奖人员'
            canSubmit = false
        } else if((genre === 0 || genre === 2) && (files || []).length === 0) {
            errMsg = '请选择发放荣誉的照片'
            canSubmit = false
        } else {
            canSubmit = true
        }

        if(!canSubmit) {
            Taro.showToast({
                title: errMsg,
                icon: 'none',
                duration: 2000
            })
            return
        }

        const checkedUserIds:string[] = []
        checkedUsers && checkedUsers.map(user => {
            checkedUserIds.push(user.userId)
        })
        dispatch({
            type: 'rewardsPunishmentsList/add',
            payload: {
                category: checkedModel.id,
                categoryName: checkedModel.name,
                imgFileList: files,
                genre,
                name,
                orgCode: checkedOrg.code,
                orgId: checkedOrg.id,
                orgName: checkedOrg.name,
                remark: '',
                type,
                userIdList: checkedUserIds,
                getDay: sendTime,
                checkedUsers,
            },
            callback: (res) => {
                const { code } = res
                if(code === 1) {
                    Taro.navigateBack({
                        delta: 1
                    })
                }
            }
        })
    }, 500)

    render() {
        const { 
            type, 
            model, 
            checkedType, 
            checkedTypeIndex, 
            checkedModel, 
            checkedModelIndex, 
            name, 
            sendTime, 
            checkedOrg,
            checkedUsers,
            showFiles,
        } = this.state;

        /** 设置已选中人员的简要头像 开始 */
        const checkedUserCount = (checkedUsers || []) .length
        let showUsers = checkedUserCount > 3 ? checkedUsers.slice(0, 3) : (checkedUsers || [])
        
        const dom = showUsers.map(user => {
            return <Djimage src={`${process.env.apiBackImgPre}${user.avatar}`} />
        })
        const checkUserImgDom = checkedUserCount > 0 ? (
            <View className='checkUserImgDom'>
                { dom }
            </View>
        ) : ''
        let checkUsersTips =  checkedUserCount === 0 ? '请选择' : `${(showUsers.length === 3 ? `等` : '')}${(checkedUsers || []).length}人`
        /** 设置已选中人员的简要头像 结束 */

        return (
        <View className='rewardsPunishmentsEdit'>
            <View className='formItems'>
                <View className='formItem line vertical'>
                    <View className='label'>奖惩名称</View>
                    <View className='content'>
                        <AtTextarea
                            placeholder='请输入奖惩名称'
                            value={name || ''}
                            onChange={this.onChangeName.bind(this)}
                            maxLength={50}
                        />
                    </View>
                </View>
                <View className='formItem line'>
                    <View className='label'>奖惩类别</View>
                    <View className='content'>
                        <Picker
                            mode='selector' 
                            range={type}
                            rangeKey='title'
                            value={checkedTypeIndex}
                            onChange={this.onChangeType.bind(this)}
                        >
                            <View className='picker'>
                            {type[checkedTypeIndex].title}
                            </View>
                        </Picker>
                        <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='32' color='#ccc'></AtIcon>
                    </View>
                </View>
                <View className='formItem line'>
                    <View className='label'>奖惩类型</View>
                    <View className='content'>
                        <Picker 
                            mode='selector' 
                            range={model[checkedTypeIndex]} 
                            rangeKey='name'
                            value={checkedModelIndex}
                            onChange={this.onChangeModel.bind(this)}
                        >
                            <View className='picker'>
                            { 
                                model && model[checkedTypeIndex] && model[checkedTypeIndex][checkedModelIndex] 
                                ? 
                                    model[checkedTypeIndex][checkedModelIndex].name 
                                : 
                                    '请选择'
                            }
                            </View>
                        </Picker>
                        <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                    </View>
                </View>
                <View className='formItem line'>
                    {
                        checkedTypeIndex === 0 ?
                        (
                            <Block>
                                <View className='label'>所属组织</View>
                                <View className='content' onClick={this.onChooseSingleOrg.bind(this)}>
                                    { checkedOrg && checkedOrg.name ? checkedOrg.name : '请选择' }
                                    <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                                </View>
                            </Block>
                        ) : (
                            <Block>
                                <View className='label'>参与人员</View>
                                <View className='content' onClick={this.onChooseUsers.bind(this)}>
                                    { checkUserImgDom }
                                    { checkUsersTips }
                                    <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                                </View>
                            </Block>
                        )
                    }
                </View>
                <View className='formItem line'>
                    <View className='label'>授予时间</View>
                    <View className='content'>
                        <Picker mode='date' value={sendTime} onChange={this.onChangeSendTime.bind(this)}>
                            <View className='picker'>
                                {sendTime || '请选择'}
                            </View>
                        </Picker>
                        <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                    </View>
                </View>
                <View className='formItem vertical'>
                    <View className='label'>上传图片</View>
                    <View className='content'>
                        <AtImagePicker
                            multiple
                            length={ 1 }
                            files={ showFiles || [] }
                            onChange={ this.onChanageFile.bind(this) }
                        />
                    </View>
                </View>
                <View className='formItem vertical'>
                    <AtButton type='primary' onClick={this.onSubmitForm.bind(this)}>提交</AtButton>
                </View>
            </View>
        </View>
        )
    }
}

export default RewardsPunishmentsDetail
