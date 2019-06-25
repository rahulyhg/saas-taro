import Taro, { Component, Config } from '@tarojs/taro'
import { Block, View, Text, ScrollView, Picker, Image, Input, Switch, Canvas } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtButton,  } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { RewardsPunishmentsDetailProps, RewardsPunishmentsDetailState } from './index.interface'
import Djimage from '../../../../pages/common/dimage'

const remoteImgPreUrl = process.env.remoteImgPreUrl
const imgChecked = remoteImgPreUrl + 'images/checked.png'

import './index.scss'

@connect(({ rewardsPunishmentsList }) => ({
    ...rewardsPunishmentsList,
}))

class RewardsPunishmentsDetail extends Component<RewardsPunishmentsDetailProps, RewardsPunishmentsDetailState> {
    config:Config = {
        navigationBarTitleText: '奖惩'
    }

    defaultProps:RewardsPunishmentsDetailProps = {
        searchDetail: { 
            imgUrl: '',
            name: '',
            type: '',
            genre: '',
            orgName: '',
            sysUserName: '',
            getDay: '',
            categoryName: '',
        } 
    }

    constructor(props: RewardsPunishmentsDetailProps) {
        super(props)
        this.state = {
            searchId: ''
        }
    }
    
    componentDidMount() {
        const { dispatch } = this.props
        const params = this.$router.params;
        console.warn(params)

        dispatch({
            type: 'rewardsPunishmentsList/getSearchDetail',
            payload: params.id
        })
    }

    componentDidShow() {
    }

    render() {
        const { searchDetail: { imgUrl, name, type, genre, orgName, sysUserName, getDay, categoryName } } = this.props

        let genreName
        if(type === '0') {
            if(genre === '0') {
                genreName = '组织荣誉'
            } else {
                genreName = '组织惩处'
            }
        } else {
            if(genre === '0') {
                genreName = '个人荣誉'
            } else {
                genreName = '个人惩处'
            }
        }

        return (
        <View className='rewardsPunishmentsDetail'>
            <View className='formItems'>
                <View className='formItem'>
                    <Djimage src={`${process.env.apiBackImgPre}${imgUrl}`}/>
                </View>
                <View className='formItem'>
                    <View className='title'>{name || ''}</View>
                </View>
                <View className='formItem line'>
                    <View className='label'>奖惩类别</View>
                    <View className='content'>{genreName || ''}</View>
                </View>
                <View className='formItem line'>
                    <View className='label'>奖惩类型</View>
                    <View className='content'>{categoryName}</View>
                </View>
                <View className='formItem line'>
                    <View className='label'>{type === '0' ? '所属组织' : '姓名'}</View>
                    <View className='content'>{type === '0' ? (orgName || '') : (sysUserName || '')}</View>
                </View>
                <View className='formItem line'>
                    <View className='label'>授予时间</View>
                    <View className='content'>{getDay || ''}</View>
                </View>
            </View>
        </View>
        )
    }
}

export default RewardsPunishmentsDetail
