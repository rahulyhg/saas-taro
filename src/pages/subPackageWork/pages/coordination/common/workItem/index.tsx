import Taro, { Component } from '@tarojs/taro'
import { View, Text , Image  } from '@tarojs/components'
import {IWorkItem} from './index.interface'
import './index.scss'

const remoteImgPreUrl = process.env.remoteImgPreUrl;

interface ISubProps {
    formItem : IWorkItem;
}

interface IState {
    rounds        : any   
    work_no_start : string
    work_doing    : string
    work_finish   : string
}

class WorkItem extends Component<ISubProps, IState>{

    constructor(props: ISubProps){
        super(props)

        this.state = ({
            work_no_start : remoteImgPreUrl + 'images/subPackageWork/work_no_start.png' ,
            work_doing    : remoteImgPreUrl + 'images/subPackageWork/work_doing.png' ,
            work_finish   : remoteImgPreUrl + 'images/subPackageWork/work_finish.png' ,

            rounds: [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                },
                {
                  image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                },
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                {
                  image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                },
                
               
              ]
        })
    }

    render(){
        const { formItem } = this.props;
        const { rounds , work_no_start , work_doing , work_finish } = this.state
        
        
        let memberList = rounds.length <= 9 ? rounds : rounds.splice(8, rounds.length - 9)

        if(formItem.state == 0){
            return (
                <View className='item-root-layout'>
                        <View className='item-layout-horizontal' style={{justifyContent:'space-between'}}>
                            <View className='layout-border-no-start' >
                                <Image className='layout-flag-img' src={work_no_start} />
                                <Text className='layout-text-no-star'>未开始</Text>
                            </View>
                    
                            <View className='item-layout-horizontal' >
                                <Image className='head-size'  src=''/>
                                <View className='head-text'>毛毛</View>
                            </View>  
                        </View>

                      <Text className='layout-title-text' style={{marginTop:'16rpx'}}>工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题</Text>
                     
                      <View className='item-layout-horizontal' style={{justifyContent:'space-between' , marginTop:'16rpx'}}>
                            <View className='item-layout-horizontal'>
                              <Text className='layout-custom-text-gray'>负责人：</Text>
                              <Text className='layout-custom-text-black'>张欣</Text>
                            </View>  
                            <Text className='layout-custom-text-gray'>截止时间：2019-09-09</Text>
                      </View>


                      <View className='item-layout-horizontal' style={{marginTop:'16rpx'}}> 
                            {
                                memberList.map((round: any) =>  (
                                    <Image className='join-head-size' src={round.image} />
                                ))
                            }
                            <Text className='layout-custom-text-gray'>{memberList.length <= 9 ? memberList.length + '人参与' : '等' + this.state.rounds.length + '人参与'}</Text>
                      </View>

                </View>
            )
        }


        if(formItem.state == 1){
            return (
                <View className='item-root-layout'>
                        <View className='item-layout-horizontal' style={{justifyContent:'space-between'}}>
                            <View className='layout-border-working' >
                                <Image className='layout-flag-img' src={work_doing} />
                                <Text className='layout-text-working'>进行中</Text>
                            </View>
                    
                            <View className='item-layout-horizontal' >
                                <Image className='head-size'  src=''/>
                                <View className='head-text'>毛毛</View>
                            </View>
                        </View>

                      <Text className='layout-title-text' style={{marginTop:'16rpx'}}>工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题</Text>
                      
                      <View className='item-layout-horizontal' style={{justifyContent:'space-between' , marginTop:'16rpx'}}>
                            <View className='item-layout-horizontal'>
                              <Text className='layout-custom-text-gray'>负责人：</Text>
                              <Text className='layout-custom-text-black'>张欣</Text>
                            </View>
                            <Text className='layout-custom-text-red'>截止时间：2019-09-09</Text>
                      </View>

                      <View className='item-layout-horizontal' style={{marginTop:'16rpx'}}> 
                            {
                                memberList.map((round: any) =>  (
                                    <Image className='join-head-size' src={round.image} />
                                ))
                            }
                            <Text className='layout-custom-text-gray'>{memberList.length <= 9 ? memberList.length + '人参与' : '等' + this.state.rounds.length + '人参与'}</Text>
                      </View>

                </View>
            )
        }


        if(formItem.state == 2){
            return (
                <View className='item-root-layout'>
                        <View className='item-layout-horizontal' style={{justifyContent:'space-between'}}>
                            <View className='layout-border-finish' >
                                <Image className='layout-flag-img' src={work_finish} />
                                <Text className='layout-text-finish'>已完成</Text>
                            </View>
                            <View className='item-layout-horizontal' >
                                <Image className='head-size'  src=''/>
                                <View className='head-text'>毛毛</View>
                            </View>
                        </View>

                      <Text className='layout-title-text-gray' style={{marginTop:'16rpx'}}>工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题工作协同回忆标题</Text>
                     
                      <View className='item-layout-horizontal' style={{justifyContent:'space-between' , marginTop:'16rpx'}}>
                            <View className='item-layout-horizontal'>
                              <Text className='layout-custom-text-gray'>负责人：</Text>
                              <Text className='layout-custom-text-black'>张欣</Text>
                            </View>
                            <Text className='layout-custom-text-gray'>截止时间：2019-09-09</Text>
                      </View>

                </View>
            )
        }
    }

}

export default WorkItem