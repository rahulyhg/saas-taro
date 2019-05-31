import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

interface ISubProps {
}
interface IState {
    initValue?: any;
    value?: any;
    onChange?: (e) => void;
}
class DemoC extends Component<ISubProps, IState> {
    
    constructor(props: ISubProps) {
        super(props)
    }

    componentWillMount() {
    }

    componentDidMount() {
    }
    render() {
        return (
            <View>没有对应type</View>
        )
    }
}

export default DemoC
