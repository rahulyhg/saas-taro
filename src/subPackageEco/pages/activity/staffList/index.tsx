import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Text, Image, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { StaffListProps, StaffListState } from './index.interface'
import './index.scss'
const remoteImgPreUrl = process.env.remoteImgPreUrl;
// import {  } from '../../components'
import Dimage from '../../../../pages/common/dimage'
import Nodata from '../../../../pages/common/nodata'
import DjLoading from '@/src/pages/common/djLoading';
@connect(({ activityDetail, loading }) => ({
    ...activityDetail,
    loading: loading.effects['activityDetail/morePeopleById']
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
        const { noDataImg, loadmore, staffList, finished, current } = this.state;
        const { loading } = this.props;
        return (
            <Block>
                <Nodata show={!loading && staffList.length == 0} notice='暂无数据' />
                {

                    !loading && <ScrollView
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
                                        <Text className="gray size28">{item.createTime}</Text>
                                    </View>
                                )
                            })
                        }

                    </ScrollView>
                }

                <DjLoading isshow={loading && current == 1} />
            </Block>

        )
    }
}

export default StaffList
