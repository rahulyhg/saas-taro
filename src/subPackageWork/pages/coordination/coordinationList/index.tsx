import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View ,Image , Text, Block} from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'
import "taro-ui/dist/style/components/tabs.scss"
import { CoordinationListProps, CoordinationListState } from './index.interface'

import  WorkItem  from '../../../../subPackageWork/pages/coordination/common/workItem'

const remoteImgPreUrl = process.env.remoteImgPreUrl;

@connect(({ coordinationList }) => ({
    ...coordinationList,
}))

class CoordinationList extends Component<CoordinationListProps, CoordinationListState>{

    config: Config = {
        navigationBarTitleText: '工作协同'
    }

    constructor(){
        super(...arguments);
        this.state={

            arrDown       :  remoteImgPreUrl + "images/news/arrDown.png",
           
            work_select_ok:  remoteImgPreUrl + 'images/subPackageWork/work_select_ok.png',

            //当前页面数字     
            current       : 0 ,
            tabs          : [
                {title: '我负责的' },
                {title: '我参与的' },
                {title: '我发布的' },
            ],

            checkList:[
                {img : remoteImgPreUrl + 'images/subPackageWork/work_all_task.png', title: '全部任务' , textColor : '#999999' },
                {img : remoteImgPreUrl + 'images/subPackageWork/work_no_start.png', title: '未开始' , textColor : '#FA5A55' },
                {img : remoteImgPreUrl + 'images/subPackageWork/work_doing.png', title: '进行中' , textColor : '#FF9F18' },
                {img : remoteImgPreUrl + 'images/subPackageWork/work_finish.png', title: '已完成' , textColor : '#2FDABF' },
            ],

            workChargeList:[
                {state : 0 , code : '1111'} ,
                {state : 1 , code : '11111'},
                {state : 2 , code : '111111'},
                {state : 0 , code : '1111111'},
                {state : 1 , code : '11111111'},
                {state : 2 , code : '111111111'},
                {state : 0 , code : '1111111111'},
                {state : 1 , code : '11111111111'},
                {state : 2 , code : '111111111111'},
            ],

            workJoinList:[
                {state : 1 , code : '2222'},
                {state : 2 , code : '22222'},
                {state : 0 , code : '222222'},
                {state : 0 , code : '2222222'},
                {state : 0 , code : '22222222'},
                {state : 1 , code : '222222222'},
                {state : 2 , code : '2222222222'},
                {state : 1 , code : '22222222222'},
                {state : 2 , code : '222222222222'},
            ],

            workSendList:[
                {state : 2 , code : '3333'},
                {state : 1 , code : '33333'},
                {state : 0 , code : '3333333'},
                {state : 2 , code : '33333333'},
                {state : 1 , code : '333333333'},
                {state : 0 , code : '3333333333'},
                {state : 2 , code : '33333333333'},
                {state : 1 , code : '333333333333'},
                {state : 0 , code : '3333333333333'},
            ],
            //是否弹出弹窗
            showCheckCover:false,
            //当前选择的选项
            checkType     : 0 ,
        }
    }

    tabClick(value: number){
        this.setState({
            current :value
        })
    }


    // 点击下来 切换类别层
    openCheckType = ()=>{
        this.setState({
            showCheckCover: true
        });
    }

     // 关闭切换 类别的层
     closeCheckType = ()=>{
        this.setState({
            showCheckCover: false
        });
    }

     // 切换类别
     checkType = (index)=>{
        console.log("***********",index)
        this.setState({
            checkType: index,
            showCheckCover: false
        });
    }
    

    render(){

        const { current ,tabs ,workChargeList ,workJoinList ,workSendList ,arrDown ,showCheckCover ,
                checkList ,checkType ,work_select_ok} = this.state

        return(
            <View style={{position:'relative'}}>
                <AtTabs current={this.state.current} tabList={tabs} onClick={this.tabClick.bind(this)}>
                    <View className='tabSpace' />
                    <AtTabsPane current={current} index={0} >
                        {
                            workChargeList.map((work: any) =>  (
                                <WorkItem key={work.code} formItem={work} />
                            ))
                        }

                    </AtTabsPane>
                    <AtTabsPane current={current} index={1}>
                        {
                            workJoinList.map((work: any) =>  (
                                <WorkItem key={work.code} formItem={work} />
                            ))
                        }
                    </AtTabsPane>
                    <AtTabsPane current={current} index={2}>
                        {
                            workSendList.map((work: any) =>  (
                                <WorkItem key={work.code} formItem={work} />
                            ))
                        }
                    </AtTabsPane>
                </AtTabs>

                <View className="picker_layout" onClick={this.openCheckType.bind(this)}>
                    <View className='border-vertical' />
                    <View className="flex contentStart">
                        <View className='c_picker-text'>任务状态</View>
                        <Image className='arrDown' src={arrDown} mode="aspectFill"/>
                    </View>
                </View>

                {
                    showCheckCover&&
                    <Block>
                        <View className='opt-bg' onClick={this.closeCheckType.bind(this)} />
                        {
                             <View className="opt-list">
                             {
                                 
                                 checkList.map((_item : any , _index : number)=>(
                                     <View className='opt-with-border'>
                                        <View className='opt-item'  key={_index} onClick={(e)=>{ 
                                        e.stopPropagation(); // 阻止事件冒泡
                                        this.checkType(_index); 
                                        }}>
                                         
                                        <View className='opt-name-layout' > 
                                           <Image className='opt-image' src={_item.img} />
                                           <Text className='opt-text' style={{color:_item.textColor}}>{_item.title}</Text>
                                        </View>
                                      
                                        {
                                             checkType === _index ?
                                             <Image className='opt-image' src={work_select_ok}/>
                                             : null
                                        }

                                        </View> 
                                        <View className='opt-border'/>
                                     </View>
                                 ))
                             }
                             </View>
                        }
                    </Block>
                    
                    
                      
                }

            </View>
        )
    }
}

export default CoordinationList