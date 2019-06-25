import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { NodataProps, NodataState } from './index.interface'
import './index.scss'
const remoteImgPreUrl = process.env.remoteImgPreUrl;

class Nodata extends Component<NodataProps,NodataState > {
    constructor(props: NodataProps) {
        super(props)
        this.state = {
            nodataImgSrc: `${remoteImgPreUrl}images/nodata.png`
        }
    }

    render() {
        return (
            this.props.show && 
            <View className='nodata' style={ this.props.stylevalue }>
                <Image
                    src={ this.state.nodataImgSrc }
                    mode='aspectFit'
                    className='nodata-img'
                    style={ this.props.imgStyle }
                />
                <View className='nodata-notice'>{ this.props.notice }</View>
            </View>
        )
    }
}

export default Nodata
