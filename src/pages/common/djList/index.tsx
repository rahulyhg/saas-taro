import Taro, { Component, Config } from "@tarojs/taro";
import { View, Block } from "@tarojs/components";
import { AtLoadMore } from 'taro-ui'
import DjLoading from '../djLoading/index'
import NoData from '../nodata/index'
import { IProps, IState } from "./index.interface";
import "./index.scss";

/**
 ```
 * 通用list组件，包含加载中、nodata
 * 外层需要包含一层已控制高度的view
 ```
 * 示例代码
 ```
    <DjList 
        key={`djlist_` + index}        // 最好传下
        listName={`djlist_` + index}   // 调试时打印log用，可以不传
        loading={loading}              // 必传：最好传dva的etffc(tab组件内需要传对应tabpanel的)
        datas={tab.datas}              // 必传：request刚取出来的数据源
        pageTotal={0}                  // 必传：当前页面的总数据数
    >
        <View>                         // 必传：这边换成你自己的数据循环体
            <View>{tab.title}</View>
            <View>{index}</View>
        </View>
    </DjList>
```
*/
class DjList extends Component<IProps, IState> {
    static options = {
        addGlobalClass: true
    }
    
    config: Config = {
        navigationBarTitleText: "list通用"
    };

    defaultProps = {
        className: ''
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: false,
            showNoData: false,
            datas: null,
            status: 'noMore',
        }
    }

    componentDidMount() {
        this.changeProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        const { loading } = nextProps
        if(loading != this.props.loading) {
            this.changeProps(nextProps)
        }
    }

    changeProps = (props) => {
        const { loading, datas, listName, pageTotal } = props
        const showNoData = ((pageTotal || 0) === 0) 
            && !loading 
            && (!datas || datas.length === 0)

        let status
        if(loading) {
            status = 'loading'
        } else if (!pageTotal || !datas || datas.length === 0) {
            status = 'noMore'
        } else {
            status = 'more'
        }

        if(listName) {
            console.warn(listName + 'componentDidMount222', {props, showNoData, status})
        }
        
        this.setState({
            loading: loading || false,
            datas,
            listName,
            showNoData,
            status,
        })
    }

    render() {
        const { children } = this.props
        const { loading, showNoData, status } = this.state
        const display = showNoData ? 'none' : 'block'
        const displayMore = status === 'more' ? 'none' : 'block'

        return (
            <Block>
                <DjLoading isshow={loading} />
                <NoData show={showNoData}  />
                <View style={{ display: display }}>
                    <View className='djListView'>
                        {children}
                    </View>
                </View>
                <View style={{ display: displayMore }}>
                    <AtLoadMore
                        status={ status } 
                        noMoreText='-- 没有更多了 --'
                    />
                </View>
            </Block>
        );
    }
}

export default DjList;
