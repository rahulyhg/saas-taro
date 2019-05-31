import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { StaffListProps, StaffListState } from './index.interface'
import './index.scss'
const remoteImgPreUrl = process.env.remoteImgPreUrl;
// import {  } from '../../components'
import Dimage from '../../../../pages/common/dimage'
@connect(({ activityDetail }) => ({
    ...activityDetail
}))

class StaffList extends Component<StaffListProps, StaffListState> {
    config: Config = {
        navigationBarTitleText: '报名人员'
    }
    constructor(props: StaffListProps) {
        super(props)
        this.state = {
            noDataImg: remoteImgPreUrl + "images/empty.png",
            staffList: [

            ],
            finished: false,
            loading: false,
            current: 1,
            pageSize: 20,
            loadmore: '加载更多',
        }
    }

    componentDidMount() {
        this.scrollLoadMore()
    }

    // 上滑加载 
    scrollLoadMore = async () => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'activityDetail/morePeopleById',
            payload: {
                current: this.state.current,
                pageSize: this.state.pageSize,
                id: this.$router.params.id
            }
        })
        if (this.props.staffList.length > 0) {
            let { staffList, current } = this.state;
            staffList = staffList.concat(this.props.staffList)
            this.setState({
                staffList: staffList,
                current: current + 1,
                finished: this.props.staffList.length < 20
            })
        } else {
            this.setState({
                finished: true
            })
        }

    }


    render() {
        const { noDataImg, loadmore, staffList, finished } = this.state;
        return (
            staffList.length == 0 ?
                <View className="nodata">
                    <Image className='nodata-img' src={noDataImg} mode="aspectFit" />
                    <View className="nodata-txt">暂无数据</View>
                </View> :
                <ScrollView
                    className='staffList-wrap'
                    scrollY
                    scrollWithAnimation
                    lowerThreshold={50}
                    onScrollToLower={this.scrollLoadMore.bind(this)}
                >
                    {
                        staffList.map((item, index) => {
                            return (
                                <View className="flex lists" key={`staffList ${index}`}>
                                    <View className="flex contentStart">
                                        <Dimage type='avatar' src={item.avatar} />
                                        <Text className="size28">{item.personName}</Text>
                                    </View>
                                    <Text className="gray size28">{item.time}</Text>
                                </View>
                            )
                        })
                    }
                    {
                        !finished && <View className="loadmore" onClick={this.scrollLoadMore.bind(this)}>{loadmore}</View>
                    }

                </ScrollView>
        )
    }
}

export default StaffList
