import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import { LoadingProps, LoadingState } from './index.interface'
import './index.scss'

class Loading extends Component<LoadingProps,LoadingState > {
    constructor(props: LoadingProps) {
        super(props)
        this.state = {
            status: 'loading',
            isShow: true
        }
    }

    componentWillMount() {
        const { loading, finished } = this.props;

        if (loading && !finished) {
            this.setState({
                status: 'loading',
                isShow: true
            });
        } else if ( finished ) {
            this.setState({
                status: 'noMore',
                isShow: true
            });
        } else {
            this.setState({
                status: 'loading',
                isShow: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { loading, finished } = nextProps;

        if (loading && !finished) {
            this.setState({
                status: 'loading',
                isShow: true
            });
        } else if ( finished ) {
            this.setState({
                status: 'noMore',
                isShow: true
            });
        } else {
            this.setState({
                status: 'loading',
                isShow: false
            });
        }
    }

    render() {
        return (
            <View style={ `display: ${this.state.isShow ? 'block' : 'none'}` }>
                <AtLoadMore status={ this.state.status } noMoreText='-- 没有更多了 --'/>
            </View>
        )
    }
}

export default Loading
