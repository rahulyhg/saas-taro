import Taro, { Component, Config } from '@tarojs/taro'
import { IndexProps, IndexState } from './index.interface'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui';


class Index extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: '附件'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            deleteVisiable: false,
            fileList: [
                {
                    title: '附件名称1',
                    imageUrl: 'https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/word.png',
                    time: '2019/5/20',
                    name: 'leo'
                }, {
                    title: '附件名称2',
                    imageUrl: 'https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/excel.png',
                    time: '2019/5/21',
                    name: 'jack'
                }, {
                    title: '附件名称3',
                    imageUrl: 'https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/ppt.png',
                    time: '2019/5/22',
                    name: 'rose'
                }
            ],
            imageList: [
                {
                    imageUrl: 'http://n.sinaimg.cn/ent/4_img/upload/d411fbc6/680/w2048h2632/20190528/8587-hxsrwwq1469329.jpg',
                    time: '2019/5/20',
                    name: '王大陆'
                }, {
                    imageUrl: 'http://n.sinaimg.cn/ent/4_img/upload/d411fbc6/680/w2048h2632/20190528/8587-hxsrwwq1469329.jpg',
                    time: '2019/5/21',
                    name: '潘长江'
                }, {
                    imageUrl: 'http://n.sinaimg.cn/ent/4_img/upload/d411fbc6/680/w2048h2632/20190528/8587-hxsrwwq1469329.jpg',
                    time: '2019/5/22',
                    name: '李明浩'
                }, {
                    imageUrl: 'http://n.sinaimg.cn/ent/4_img/upload/d411fbc6/680/w2048h2632/20190528/8587-hxsrwwq1469329.jpg',
                    time: '2019/5/23',
                    name: '你好你还闹'
                }
            ],
        }
    }

    componentDidMount() {

    }

    onUploadImg = e => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {

            }
        })

    }


    deleteFile = () => {

    }

    toImageDetailPage = (imageUrl) => {
        Taro.navigateTo({
            url: '../imageDetail/index?imageUrl=' + imageUrl
        })
    }

    showDeleteView = (index) => {
        console.log("您点击了" + index);
        this.setState({
            deleteVisiable: true
        })
    }


    dismissDeleteView = () => {
        this.setState({
            deleteVisiable: false
        })
    }


    render() {
        const { fileList, imageList, deleteVisiable } = this.state;

        return (
            <View className='root-view'>
                <Text className='file-text'>文件</Text>
                <View className="file-list-root">
                    {
                        fileList.map((item, index) => {
                            return <View className='at-row item'>
                                <View at-col at-col--auto>
                                    <Image className='item-image' src={item.imageUrl}></Image>
                                </View>
                                <View className='at-col right'>
                                    <Text className='title'>{item.title}</Text>
                                    <View className='at-row at-row__justify--between'>
                                        <View className='at-row'>
                                            <Text className='name'>{item.name}</Text>
                                            <Text className='time'>{item.time}</Text>
                                        </View>
                                        <Image onClick={this.showDeleteView.bind(this, index)} className='delete' src='https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/deleteIcon.png'></Image>
                                    </View>
                                </View>
                            </View>
                        })
                    }
                </View>

                <View className='image-text'><Text >图片</Text></View>

                <View className="image-list-root at-row at-row--wrap">
                    {
                        imageList.map((item) => {
                            return <View className='at-col at-col-6 list-item'>
                                <Image onClick={this.toImageDetailPage.bind(this, item.imageUrl)} className='image-view' src={item.imageUrl}></Image>
                                <View className='at-row at-row__justify--between'>
                                    <Text className='name'>{item.name}</Text>
                                    <Text className='time'>{item.time}</Text>
                                </View>
                            </View>
                        })
                    }
                </View>

                <Image
                    onClick={this.onUploadImg}
                    src={'https://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageWork/upload_image.png'}
                    mode='aspectFit'
                    className="upload-btn" />

                <AtActionSheet
                    cancelText='取消'
                    isOpened={deleteVisiable}
                    onCancel={this.dismissDeleteView}
                    onClose={this.dismissDeleteView}
                    title='清除该文件后无法回复'>
                    <AtActionSheetItem>
                        <Text onClick={this.deleteFile} className='delete'>删除</Text>
                    </AtActionSheetItem>
                </AtActionSheet>


            </View>
        );
    }
}

export default Index