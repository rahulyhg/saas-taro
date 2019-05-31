import Taro ,{ Component, Config } from '@tarojs/taro'
import { IndexProps, IndexState } from './index.interface'
import { AtTabs, AtTabsPane , AtAvatar, AtActionSheet, AtActionSheetItem, AtInput , AtTextarea , AtIcon} from 'taro-ui'
import { ScrollView, View, Text , Image, Button } from '@tarojs/components';
import './index.scss'
import { connect } from '@tarojs/redux'

const remoteImgPreUrl = process.env.remoteImgPreUrl;

@connect(({ index  , orgPopView , userPopView , userSinglePopView }) => ({
    ...index,
    checkedOrgList : orgPopView.checkedList,
    checkedUserList: userPopView.checkedList,
    chargePeople   : userSinglePopView.checkedUserList,
}))


class Index extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: '工作协同'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {

            tabCurrent: 0,
            commentActionSheetVisiable: false,
            replayName: '',
            dynamicList: [
                {
                    name: 'LEO',
                    accountImage: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1834760482,564838457&fm=26&gp=0.jpg',
                    time: '2019/5/20',
                    state: 1
                }
            ],
            commentList: [
                {
                    name: 'LEO',
                    accountImage: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1834760482,564838457&fm=26&gp=0.jpg',
                    time: '2019/5/20',
                    content: "哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦哎呦呦，不错哦",
                    replayList: [
                        {
                            p1: 'jack',
                            p2: 'leo',
                            replayContent: '脑子不好吧，天天发这个天天发这个天天发这个天天发这个天天发这个天天发这个'
                        },
                        {
                            p1: 'rose',
                            p2: 'jack',
                            replayContent: '管好你自己吧'
                        },
                    ]
                }
            ],




            //以下是处理模块的参数
            righr_arrow          : remoteImgPreUrl + 'images/subPackageWork/arrR.png' ,
            work_no_start        : remoteImgPreUrl + 'images/subPackageWork/work_no_start.png' ,
            work_doing           : remoteImgPreUrl + 'images/subPackageWork/work_doing.png' ,
            work_finish          : remoteImgPreUrl + 'images/subPackageWork/work_finish.png' ,
            work_charge_people   : remoteImgPreUrl + 'images/subPackageWork/work_charge_people.png' ,

            workTitle            : '',
            chargePeople         : [],
            checkedOrgList       : [],
            chooseType           :  0,
            checkedJoinUserList  : [],
            checkWhoCanWatchList : [],
        }
    }

    componentDidMount() {
        this.handleEcoTabClick(this.state.tabCurrent);
    }

    handleEcoTabClick(val: number) {
        this.setState({
            tabCurrent: val
        });
        switch (val) {
            case 0:
                // this.getList(true, 'getPageList');
                break;
            case 1:
                // this.getList(true, 'getActionPageList');
                break;
            case 2:
                // this.getList(true, 'getMyPageList');
                break;
        }
    }

    loadMoreDynamicEvt() {
        var list = this.state.dynamicList;
        list.push({
            name: 'LEO',
            accountImage: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1834760482,564838457&fm=26&gp=0.jpg',
            time: '2019/5/20',
            state: '修改任务状态为进行中'
        });
        this.setState({
            dynamicList: list
        });
    }

    //评论列表item点击时弹出回复框
    onCommentListItemClik(item) {
        this.setState({
            commentActionSheetVisiable: true,
            replayName: `回复${item.name}:`
        });
    }

    //回复框关闭时回调
    onCommentActionSheetClose() {
        this.setState({
            commentActionSheetVisiable: false
        });
    }


    onChange = () =>{

    }




    //处理模块

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

    //标题监听
    workTitleHandleChange (event: { target: { value: string; }; }) {
        this.setState({
            workTitle: event.target.value
        })
    }


     // 参与组织选择
     handleChooseOrg = () => {
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        })
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

    render() {

        const { dynamicList, commentList, commentActionSheetVisiable, replayName ,
            work_no_start , work_doing , work_finish  , work_charge_people , righr_arrow , checkedOrgList ,
            chargePeople , checkedJoinUserList , checkWhoCanWatchList } = this.state;
        return (
            <View>
                <View className='space-view'></View>
                <AtTabs swipeable={false} className="root-view"
                    current={this.state.tabCurrent}
                    tabList={[
                        { title: '处理' },
                        { title: '评论' },
                        { title: '状态' }
                    ]}
                    onClick={this.handleEcoTabClick.bind(this)}>
                    <AtTabsPane current={this.state.tabCurrent} index={0}>
                        <ScrollView className="list-root-scroll" scrollY scrollWithAnimation >
                            <View className='parent-layout'>

                                <Text className='deal-title'>这是一个很长很长很长很长很长很长很长很长很长很长两行的标题标题标题标题标题 </Text>

                                <View className='item-row' style={{paddingLeft:'32rpx',paddingRight:'32rpx' , paddingTop:'32rpx'}}>
                                    <View className='item-row' style={{flex:1}} >
                                        <Image className='layout-flag-img' src={work_no_start} />
                                        <View className = 'item-vertical' style={{marginLeft:'10rpx'}}>
                                            <Text className='item-pick-text' >未开始</Text>
                                            <Text className='item-pick-state-text'>状态</Text>
                                        </View>
                                    </View>

                                    <View className='border-vertical' />

                                    <View className='item-row' style={{flex:1 , paddingLeft: '50rpx'}} >
                                        <Image className='layout-flag-img' src={work_charge_people} />
                                        <View className = 'item-vertical' style={{marginLeft:'10rpx'}}>
                                            <Text className='item-pick-text'  >张明</Text>
                                            <Text className='item-pick-state-text'>负责人</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className='border' style={{marginTop:'32rpx'}}/>

                                <View className='item-row' style={{paddingLeft:'32rpx',paddingRight:'32rpx' , paddingTop:'32rpx'}}>
                                    <View className='item-vertical' style={{flex:1}} >
                                        <Text className='item-pick-text' >开始时间</Text>
                                        <Text className='item-date-state-text'>4月30号</Text>
                                    </View>

                                    <Image style={{height:'60rpx' , width:'20rpx'}} src={righr_arrow} />

                                    <View className='item-vertical' style={{flex:1 , paddingLeft: '50rpx'}} >    
                                        <Text className='item-pick-text'>结束时间</Text>
                                        <Text className='item-date-state-text'>2019年9月2日</Text>
                                    </View>

                                </View>


                                <View className='border' style={{marginTop:'32rpx'}}/>

                                <Text className='item-title-text' style={{marginLeft:'32rpx',marginTop:'32rpx'}}>任务描述</Text>

                                <AtTextarea count={false} value={this.state.workTitle}  maxLength={200} height={160}
                                            onChange={this.workTitleHandleChange.bind(this)} placeholder='点击输入描述名字' /> 

                                <View className='big-border'/>

                                <View className='item-row-between' onClick={this.handleChooseOrg}>
                                    <Text className='item-title-text'>参与组织</Text>

                                    <View className ='item-row-right'>
                                    {
                                        checkedOrgList.length == 0  ?
                                        <Text className='item-text-gray'  >请选择</Text> :
                                        <Text className='item-text-black' >{checkedOrgList.length + '个组织'}</Text>
                                    }
                                        
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                            
                                    </View>
                                </View>

                                <View className='border'/>

                                <View className='item-row-between' onClick={this.handleChooseJoinUser}>
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

                                <View className='item-row-between' onClick={this.handleChooseWhoCanWatch}>
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


                                <View className='item-row-between' >
                                    <Text className='item-text-black'>附件</Text>

                                    <View className ='item-row-right'>
                                    
                                        <Text className='item-text-gray'  >3个</Text> 
                                        
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                            
                                    </View>
                                </View>

                                <View className='border' />



                                <View className ='item-row' style={{marginTop:'60rpx'}}>
                                    <Button className='button-del'>删除</Button>
                                    <Button className='button-save'>保存</Button>
                                </View>
                            </View>
                        </ScrollView>
                    </AtTabsPane>
                    <AtTabsPane current={this.state.tabCurrent} index={1}>
                        {
                            this.state.commentList.length > 0 &&
                            <ScrollView className="list-root-scroll" scrollY scrollWithAnimation>
                                <View className="tab-content tab2-list-root">
                                    {
                                        commentList.map((item) => {
                                            return <View className='at-row comment-list-item' onClick={this.onCommentListItemClik.bind(this, item)}>
                                                <View>
                                                    <AtAvatar className='account-img' circle image={item.accountImage}></AtAvatar>
                                                </View>
                                                <View className='at-col at-col--wrap right'>
                                                    <View className='at-row at-row__justify--between'>
                                                        <View className='name'>{item.name}</View>
                                                        <View className='time'>{item.time}</View>
                                                    </View>
                                                    <View className='state'>{item.state}</View>
                                                    <View className='content'>{item.content}</View>
                                                    <View className='triangle'></View>

                                                    <View className='replay-list'>
                                                        {
                                                            item.replayList.map((replayItem) => {
                                                                return (
                                                                    <View className='replay-content-item'>
                                                                        <Text className='replay-name'>{replayItem.p1}</Text>
                                                                        <Text className='replay-text'>回复</Text>
                                                                        <Text className='replay-name'>{replayItem.p2}：</Text>
                                                                        <Text className='replay-content'>{replayItem.replayContent}</Text>
                                                                    </View>
                                                                )

                                                            })
                                                        }
                                                    </View>


                                                </View>
                                            </View>
                                        })
                                    }
                                </View>
                            </ScrollView>

                        }
                    </AtTabsPane>
                    <AtTabsPane current={this.state.tabCurrent} index={2}>
                        {
                            this.state.dynamicList.length > 0 &&
                            <ScrollView className="list-root-scroll"
                                scrollY
                                scrollWithAnimation
                                lowerThreshold={50} onScrollToLower={this.loadMoreDynamicEvt.bind(this)}>
                                <View className="tab-content tab3-list-root">
                                    {
                                        dynamicList.map((item) => {
                                            return <View className='at-row dynamic-list-item'>
                                                <View>
                                                    <AtAvatar className='account-img' circle image={item.accountImage}></AtAvatar>
                                                </View>
                                                <View className='at-col right'>
                                                    <View className='at-row at-row__justify--between'>
                                                        <View className='name'>{item.name}</View>
                                                        <View className='time'>{item.time}</View>
                                                    </View>
                                                    <View className='state'>{item.state}</View>
                                                </View>
                                            </View>
                                        })
                                    }
                                </View>
                                <View className="loadmore" onClick={this.loadMoreDynamicEvt.bind(this)}>加载更多</View>
                            </ScrollView>
                        }
                    </AtTabsPane>
                </AtTabs>
                {
                    this.state.tabCurrent == 1 && <AtActionSheet isOpened={commentActionSheetVisiable} onClose={this.onCommentActionSheetClose.bind(this)}>
                        <AtActionSheetItem>
                            <AtInput
                                className='input_reply'
                                name='value'
                                placeholder={replayName}
                                border={false} 
                                onChange = {this.onChange}/>

                        </AtActionSheetItem>
                    </AtActionSheet>
                }
            </View>
        );
    }
}

export default Index