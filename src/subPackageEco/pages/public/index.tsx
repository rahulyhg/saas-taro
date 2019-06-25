import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { PublicProps, PublicState } from './index.interface'
import { globalData } from '../../../utils/common'
import { AtButton, AtTextarea, AtImagePicker, AtForm, AtSwitch  } from 'taro-ui'
import './index.scss'
const remoteImgPreUrl = process.env.remoteImgPreUrl

@connect(({ common, eco }) => ({
    ...common,
    ...eco,
}))


class Public extends Component<PublicProps,PublicState > {
    config:Config = {
        navigationBarTitleText: '发布生态'
    }
    constructor(props: PublicProps) {
        super(props)
        this.state = {
            fileArr: [],
            picArray: [],
            content: '',
            textAreaHeight: 128,
            isLocation: false,
            lat: 0,
            lng: 0
        }
    }

    componentDidMount() {
        
    }

    handleTextareaChange(e) {
        let content = e.detail.value.trim();

        if ( content.length > 1500 ) {
            Taro.showToast({
                title: '内容过长，请精简至1500字包含标点字符',
                icon: 'error',
                duration: 2000
            });

            return false;
        }

        this.setState({ content });
    }

    onFileChange(fileArr) {
        fileArr.forEach(file => {
            file.fileType = 'image';
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadMultiFile',
            payload: {
                fileArr,
                businessName: 'eco'
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        picArray: res.data
                    });
                }

                this.setState({ 
                    fileArr
                });
            }
        });
    }

    handleLineChange(e) {
        if( e.detail.heightRpx > 108 && e.detail.lineCount <= 10) {
            this.setState({ textAreaHeight: e.detail.heightRpx + 40 });
        }
    }

    onImageClick(index, file) {
        Taro.previewImage({
            urls: this.state.fileArr.map(file => {
                return file.url;
            }),
            current: file
        });
    }

    handleLocationChange(val) {
        this.setState({
            isLocation: val
        });

        if(val) {
            Taro.getLocation({
                success: location => {
                    this.setState({
                        lat: location.latitude,
                        lng: location.longitude
                    });
                },
                fail: () => {
                    this.setState({
                        isLocation: val
                    });

                    Taro.showToast({
                        title: '位置信息获取失败，请稍后再试',
                        image: '../../images/toastError.png',
                        duration: 2000
                    });
                }
            });
        }
    }

    onSubmit() {
        if( !this.state.content.trim() ) {
            Taro.showToast({
                title: "说点什么吧",
                image: '../../images/toastError.png',
                duration: 2000
            });

            return false
        }

        Taro.showLoading({
            mask: true,
            title: '正在提交...'
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'eco/addEco',
            payload: {
                content: this.state.content,
                lat: this.state.lat,
                lng: this.state.lng,
                location: this.state.isLocation ? 1 : 0,
                picArray: this.state.picArray.map(pic => {
                    return pic.id
                })
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        content: '',
                        lat: 0,
                        lng: 0,
                        isLocation: false,
                        fileArr: []
                    });

                    Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                        Taro.showToast({
                            title: '提交成功',
                            icon: 'success',
                            duration: 2000
                        });
                    });

                    return false;
                }

                Taro.showToast({
                    title: res.msg,
                    image: '../../images/toastError.png',
                    duration: 2000
                });
                
            }
        });
    }

    render() {
        const { fileArr} = this.state
        return (
        <View className='public'>
            <AtForm>
                <View className='public-content'>
                    <AtTextarea
                        count={ false }
                        value={ this.state.content }
                        onChange={ this.handleTextareaChange.bind(this) }
                        onLinechange={ this.handleLineChange.bind(this) }
                        maxLength={ 1500 }
                        height={ this.state.textAreaHeight }
                        placeholder='你想说点啥…'
                    />

                    <AtImagePicker
                        multiple
                        length={ 6 }
                        files={ fileArr}
                        onChange={ this.onFileChange.bind(this) }
                        onImageClick={this.onImageClick.bind(this) }
                    />
                </View>
                <View className='public-location'>
                    <AtSwitch title='显示当前位置' color='#FF574F' checked={ this.state.isLocation } onChange={ this.handleLocationChange.bind(this) } />
                </View>
            </AtForm>
            <View className='public-btn'>
                <AtButton type='primary' onClick={ this.onSubmit.bind(this) }>提交</AtButton>
            </View>
        </View>
        )
    }
}

export default Public
