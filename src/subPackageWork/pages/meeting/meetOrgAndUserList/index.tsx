import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// const remoteImgPreUrl = process.env.remoteImgPreUrl;
import { ImeetOrgAndUserListProps, ImeetOrgAndUserListState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'

@connect(({ meetOrgAndUserList }) => ({
    ...meetOrgAndUserList,
}))

class MeetOrgAndUserList extends Component<ImeetOrgAndUserListProps,ImeetOrgAndUserListState > {
    config:Config = {
        navigationBarTitleText: '会议'
    }
    constructor(props: ImeetOrgAndUserListProps) {
        super(props)
        this.state = {
            listType: '', // 类别 org组织列表、 user人员列表
            listData: [], // 上一页 带过来的参数
        }
    }

    componentDidMount() {
        const params = this.$router.params;// 页面参数
        const listData = JSON.parse(params.listData); // 对应数据列表
        const listType = params.listType; // listType: org组织列表、 user人员列表
        this.setState({
            listType,
            listData
        });
        // 页面 title 设置
        let pageTitle = listType == 'org' ? '参会组织列表' : '参会人员列表';
        Taro.setNavigationBarTitle({
            title: pageTitle
        });
    }

    render() {
        const { listData, listType } = this.state; // listType类别 org组织列表、 user人员列表
        return (
            <View className='meetOrgAndUserList-wrap'>
                {
                    listType == 'org' ? 
                    listData.map((item, index)=>{
                        return (
                            <View className="lists" key={`ld_${index}`} >{item.name}</View>
                        ) 
                    }) : 
                    listData.map((item, index)=>{
                        return (
                            <View className="lists flex">
                                <Dimage 
                                    key={`ld_${index}`} 
                                    type='avatar'
                                    src={item.avatar} 
                                    mode='aspectFill' 
                                    styleValue='width: 52rpx; height: 52rpx; border-radius: 50%;'
                                    />
                                <Text>{item.userName}</Text>
                            </View>
                        ) 
                    })
                }
                <View className='loadmore'>- 到底啦 -</View>
            </View>
        )
    }
}

export default MeetOrgAndUserList
