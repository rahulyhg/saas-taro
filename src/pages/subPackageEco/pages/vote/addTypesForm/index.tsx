import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Textarea } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AddTypesFormProps, AddTypesFormState } from './index.interface'
const remoteImgPreUrl = process.env.remoteImgPreUrl
import './index.scss'
import "../../../style/formRap.scss"
// import {  } from '../../components'

@connect(({ addVoteTypesForm }) => ({
    ...addVoteTypesForm,
}))

class AddVoteTypesForm extends Component<AddTypesFormProps,AddTypesFormState > {
    config:Config = {
        navigationBarTitleText: '发布投票活动'
    }
    constructor(props: AddTypesFormProps) {
        super(props)
        this.state = {
            grayDelet: remoteImgPreUrl + "images/subPackageEco/grayDelet.png",
            atcDeletIcon: remoteImgPreUrl + "images/subPackageEco/redDelet.png",
            isShowDeletBtn: false,// 是否显示删除按钮
            cover: '',// 上传的问题
            title: '',// 用户输入的 标题
            remark: '',// 用户输入的 详情
        }
    }

    componentDidMount() {
        const pageParams = this.$router.params.pageParams ? JSON.parse(this.$router.params.pageParams) : null;
        const index = this.$router.params.index ? this.$router.params.index : null;
        this.setState({
            index,
            cover: pageParams.cover,// 上传的问题
            title: pageParams.title,// 用户输入的 标题
            remark: pageParams.remark,// 用户输入的 详情
            isShowDeletBtn: pageParams ? true : false
        });
    }

    // 上传图片
    upLoadImgApi(_file){
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            file: _file,
            businessName: 'activity',// 文件夹名字，活动 统一传 activity
        }
        dispatch({
            type: 'addVoteTypesForm/imageUpload',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.data){
                    const cover = JSON.parse(res.data).path;
                    this.setState({
                        cover
                    })
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    }).then(res => console.log(res.confirm, res.cancel));
                }
            }
        });
    }

    // 更新model 状态值
    updateState(param){
        const { dispatch } = this.props;
        dispatch({
            type: 'addVoteTypesForm/saveData',
            payload: param,
        });
    }

    
    // 点击上传图片
    upLoadImg(){
        Taro.chooseImage().then((e)=>{
            console.log(e.tempFilePaths[0])
            const file = e.tempFilePaths[0];
            this.upLoadImgApi(file);
        })
    }

    // 输入 投票内容 监听
    inputTextArea(e){
        this.setState({
            title: e.detail.value
        })
    }

    // 输入 详细内容 监听
    inputDetail(e) {
        const remark = e.detail.value;
        this.setState({
            remark
        });
    }

    // 清空 用户输入的内容
    deletInputDetail(e) {
        e.stopPropagation();// 阻止冒泡
        this.setState({
            remark: ''
        });
    }

    // 点击 保存
    saveEvt(){
        const { index, title, cover, remark, isShowDeletBtn } = this.state;
        this.updateState({
            index,
            title, // 用户输入的 标题
            cover, // 上传的图片
            remark, // 用户输入的 详情
            isShowDeletBtn,// 是否是编辑==》 true：编辑、false：新增
        });
        
        Taro.navigateBack({
            delta: 1
        });
        
    }

    // 点击 删除 该条编辑项 并关闭当前页面
    deletEvt(){
        console.log("删除")
        Taro.navigateBack({
            delta: 1
        });
    }


    // 删除当前行 已填写信息
    deletThisItem(){
        this.setState({
            cover: '',
            title: ''
        });
    }

    // 点击删除 上传的图片
    deletUpLoadImg(){
        this.setState({
            cover: ''
        });
    }


    render() {
        const { grayDelet, title, remark, 
                atcDeletIcon, isShowDeletBtn, cover } = this.state;
        return (
            <View className='addTypesForm-wrap'>
                <View className="flex itemCenter formList listPad">
                    <View className="flex contentStart itemCenter">
                        {
                            cover ?
                            <View className="posrel">
                                <Image className='listLeftImg' src={process.env.apiBackImgPre + cover} mode="aspectFit"/>
                                <Image className='deleteImg' src={atcDeletIcon} mode="aspectFit" onClick={this.deletUpLoadImg.bind(this)}/>
                            </View> :
                            <View className="mindUpImgView" onClick={this.upLoadImg.bind(this)}>
                                <View className="size30">上传图片</View>
                                <View className="size24">（选填）</View>
                            </View>
                        }
                        
                        <Textarea placeholder="点击编辑投票内容" 
                            onInput={this.inputTextArea.bind(this)} 
                            value={title}
                            className="listRightTxt listRightArea"></Textarea>
                    </View>
                    <Image className='grayDeletIcon myTop' 
                        onClick={this.deletThisItem.bind(this)} 
                        src={grayDelet} 
                        mode="aspectFill"/>
                </View>

                <View className="posrel formList">
                    <Input className="label labelInput" value={remark} type='text' maxLength={80} onInput={this.inputDetail} 
                        placeholder="点击编辑投票详情（选填）" focus/>
                    <Image className='grayDeletIcon active'  src={grayDelet} mode="aspectFill" 
                        onClick={this.deletInputDetail}/>
                </View>
                {/* 按钮 */}
                <View className="btnContain">
                    <View className="redBgBtn" onClick={this.saveEvt}>保存</View>
                    {
                        // 如果 是从 新增自定义项目 跳过来的（placeholder有值的时候） 才显示删除按钮，
                        isShowDeletBtn ? <View className="whiteBgBtn" onClick={this.deletEvt}>删除</View> : null
                    }
                </View>
            </View>
        )
    }
}

export default AddVoteTypesForm
