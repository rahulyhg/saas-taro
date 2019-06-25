import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { DimageProps, DimageState } from './index.interface'
const remoteImgPreUrl = process.env.remoteImgPreUrl;

class Dimage extends Component<DimageProps,DimageState > {
    static options = {
        addGlobalClass: true
    }
    
    constructor(props: DimageProps) {
        super(props)
        this.state = {
            errorAvatarUrl: '',
            defaultAvatarUrl: `${remoteImgPreUrl}images/default-avatar.png`,
            errorImageUrl: '',
            defaultImageUrl: 'https://f1.71dj.org/mobile-pro/img/tx1@2x.f294bc0e.png'
        }
    }

    clickEvent(e) {
        const { onClick } = this.props;
        if(onClick) {
            e.stopPropagation();
            onClick();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            errorAvatarUrl: '',
            errorImageUrl: '',
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.errorAvatarUrl == this.state.errorAvatarUrl) {
            return false;
        }
    }

    render() {
        const { src, styleValue, type, mode } = this.props;
        const { errorAvatarUrl, defaultAvatarUrl, errorImageUrl, defaultImageUrl } = this.state;
        const errorImg = type ? errorAvatarUrl : errorImageUrl
        const defaultImg = type ? defaultAvatarUrl : defaultImageUrl
        

        return (
            <Image
                src={ errorImg || src || defaultImg }
                mode={ mode }
                onError={() => {
                    if (type == 'avatar') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-avatar.png'
                        });
                    } else if (type == '0') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-eco.png'
                        });
                    } else if (type == '1') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-activity.png'
                        });
                    } else if (type == '2') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-vote.png'
                        });
                    } else if (type == '3') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-survey.png'
                        });
                    } else if (type == '4') {
                        this.setState({
                            errorAvatarUrl: remoteImgPreUrl + 'images/default-answer.png'
                        });
                    } else {
                        this.setState({
                            errorImageUrl: 'https://f1.71dj.org/mobile-pro/img/tx1@2x.f294bc0e.png'
                        });
                    }
                    
                }}
                onClick={ this.clickEvent.bind(this) }
                style={ styleValue }
            />
        )
    }
}

export default Dimage
