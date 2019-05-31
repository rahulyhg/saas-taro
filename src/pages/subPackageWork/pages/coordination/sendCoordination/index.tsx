import Taro, { Component, Config } from '@tarojs/taro'
import { AtTextarea , AtIcon } from 'taro-ui'
import { View  , Text , Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'
import "taro-ui/dist/style/components/textarea.scss";



import { SendCoordinationProps, SendCoordinationState } from './index.interface'


@connect(({ sendCoordination , orgPopView , userPopView , userSinglePopView}) => ({
    ...sendCoordination,
    checkedOrgList : orgPopView.checkedList,
    checkedUserList: userPopView.checkedList,
    chargePeople   : userSinglePopView.checkedUserList,
}))

class SendCoordination extends Component<SendCoordinationProps, SendCoordinationState>{

    config: Config = {
        navigationBarTitleText: '工作协同'
    }

    constructor(){
        super(...arguments);
        this.state = {
            workTitle           : '',
            endTime             : '',
            //负责人
            chargePeople        : [],
            //参与组织
            checkedOrgList      : [],
             //选择参与人员还是观看人员 , 1 参与人员  2 观看人员
            chooseType          :  0,
            //参与人员
            checkedJoinUserList : [],
            //谁可以看
            checkWhoCanWatchList: [],

        }
    }

    workTitleHandleChange (event: { target: { value: string; }; }) {
        this.setState({
            workTitle: event.target.value
        })
    }

    //选择负责人
    chargePeopleSelect = () => {
        Taro.navigateTo({
            url: '../../../../pages/common/userSinglePopView/userSinglePopView'
        })
    }

    //选择截止时间
    chooseEndTime = (e: { detail: { value: string; }; }) => {
        this.setState({
            endTime : e.detail.value,
        })
    }



    // 参与组织选择
    handleChooseOrg = () => {
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        })
    }

    componentDidShow(){
        this.setState({
            checkedOrgList : this.props.checkedOrgList,
            chargePeople   : this.props.chargePeople,
        })

        if(this.state.chooseType == 1 ){
            this.setState ({
                checkedJoinUserList : this.props.checkedUserList ,
            })
        }else if(this.state.chooseType == 2 ){
            this.setState ({
                checkWhoCanWatchList : this.props.checkedUserList ,
            })
        }
    }
   

    // 参与人员选择
    handleChooseJoinUser = () => {
        this.setState ({
            chooseType : 1 
        })

        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        })
    }

    //谁可以看
    handleChooseWhoCanWatch = () => {
        this.setState ({
            chooseType : 2
        })

        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        })

    }



    render(){

        const {chargePeople , endTime , checkedOrgList , checkedJoinUserList , checkWhoCanWatchList} = this.state

        return(
            <View className='parent-layout'>

                <View className='big-border' /> 

                <AtTextarea count={false} value={this.state.workTitle}  maxLength={200} height={160}
                onChange={this.workTitleHandleChange.bind(this)} placeholder='点击输入任务名称' /> 

                <View className='border' />

                <View className='item-row' onClick={this.chargePeopleSelect}>
                    <Text className='item-text-black'>负责人</Text>

                    <View className ='item-row-right'>
                    {
                        chargePeople === '' ?
                        <Text className='item-text-gray'  >请选择</Text> :
                        <Text className='item-text-black' >{chargePeople}</Text>
                    }
                        
                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
               
                    </View>
                </View>

                <View className='border' />

                <View className='item-row' onClick={this.chooseEndTime}>
                    <Text className='item-text-black'>截止时间</Text>
                        <View className ='item-row-right'>
                            <Picker mode='date' onChange={this.chooseEndTime} value={endTime}>
                            {
                                endTime === '' ?
                                <Text className='item-text-gray'  >请选择</Text> :
                                <Text className='item-text-black' >{endTime}</Text>
                            }
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                            </Picker>
                        </View>
                </View>

                <View className='big-border' />

                <View className='item-row' onClick={this.handleChooseOrg}>
                    <Text className='item-text-black'>参与组织</Text>

                    <View className ='item-row-right'>
                    {
                        checkedOrgList.length == 0  ?
                        <Text className='item-text-gray'  >请选择</Text> :
                        <Text className='item-text-black' >{checkedOrgList.length + '个组织'}</Text>
                    }
                        
                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
               
                    </View>
                </View>

                <View className='border' />


                <View className='item-row' onClick={this.handleChooseJoinUser}>
                    <Text className='item-text-black'>参与人员</Text>

                    <View className ='item-row-right'>
                    {
                        checkedJoinUserList.length == 0  ?
                        <Text className='item-text-gray'  >请选择</Text> :
                        <Text className='item-text-black' >{checkedJoinUserList.length + '个组织'}</Text>
                    }
                        
                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
               
                    </View>
                </View>

                <View className='border' />

                <View className='item-row' onClick={this.handleChooseWhoCanWatch}>
                    <Text className='item-text-black'>谁可以看</Text>

                    <View className ='item-row-right'>
                    {
                        checkWhoCanWatchList.length  == 0  ?
                        <Text className='item-text-gray'  >相关人员</Text> :
                        <Text className='item-text-black' >{checkWhoCanWatchList.length + '个组织'}</Text>
                    }
                        
                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
               
                    </View>
                </View>

                <View className='border' />


                <View className='item-row' onClick={this.chargePeopleSelect.bind(this)}>
                    <Text className='item-text-black'>发布人</Text>
                    
                    <Text className='item-text-gray'  >张明</Text>                
                    
                </View>

            </View>
        )
    }
}

export default SendCoordination