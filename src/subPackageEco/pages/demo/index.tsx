import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import DjLoading from '@/src/pages/common/djLoading'

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    onOpen = (e) => {
        this.setState({
            loading: true
        })
    }

    onClose = (e) => {
        this.setState({
            loading: false
        })
    }

    render() {
        const {loading} = this.state

        return (
            <View>
                <AtButton onClick={this.onOpen.bind(this)}>开启</AtButton>
                <AtButton onClick={this.onClose.bind(this)}>关闭</AtButton>

                <View style={{marginTop: '200rpx'}}>
                    <DjLoading isshow={loading} />
                </View>
            </View>
        )
    }
}

export default Demo
