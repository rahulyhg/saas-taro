import Taro, { Component, Config } from '@tarojs/taro'
import { IndexProps, IndexState } from './index.interface'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtActionSheet, AtActionSheetItem, AtFab, AtAvatar, AtIcon } from 'taro-ui';

class Index extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: '工作协同'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            imageUrl: '',
            deleteVisiable: false,
        }
    }

    componentDidMount() {
        this.setState({
            imageUrl: this.$router.params.imageUrl
        })
    }



    showDeleteView = (index) => {
        console.log("您点击了" + index);
        this.setState({
            deleteVisiable: true
        })
    }


    onDeleteImg = (index) => {

    }

    dismissDeleteView = () => {
        this.setState({
            deleteVisiable: false
        })
    }


    render() {
        const { imageUrl, deleteVisiable } = this.state;
        return (
            <View className='root-view'>
                <Image
                    src={imageUrl}
                    mode='aspectFit'
                    className="image-view" />

                <View className="delete-view">
                    <Image
                        className="delete-btn"
                        onClick={this.showDeleteView}
                        src={'https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/delete_white.png'} />
                </View>

                <AtActionSheet
                    cancelText='取消'
                    isOpened={deleteVisiable}
                    onCancel={this.dismissDeleteView}
                    onClose={this.dismissDeleteView}
                    title='清除该文件后无法回复'>
                    <AtActionSheetItem>
                        <Text onClick={this.onDeleteImg} className='delete'>删除</Text>
                    </AtActionSheetItem>
                </AtActionSheet>
            </View>
        );
    }
}

export default Index