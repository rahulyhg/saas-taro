import Taro, { Component, Config } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { LoadingProps, LoadingState } from './index.interface'
import './index.scss'

class Loading extends Component<LoadingProps,LoadingState > {
    constructor(props: LoadingProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View className='loading'>
                {
                    this.props.loading && !this.props.finished ?
                        <Text>loading</Text>
                    : ''
                }

                {
                    this.props.finished ?
                        <Text>finished</Text>
                    : ''
                }
            </View>
        )
    }
}

export default Loading
