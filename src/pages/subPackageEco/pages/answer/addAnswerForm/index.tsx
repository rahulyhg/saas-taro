import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { AddAnswerFormProps, AddAnswerFormState } from './index.interface'
import './index.scss'
import "../../../style/formRap.scss"
const remoteImgPreUrl = process.env.remoteImgPreUrl

// import {  } from '../../components'

@connect(({ answer }) => ({
    ...answer,
}))


class AddVoteForm extends Component<AddAnswerFormProps, AddAnswerFormState> {


    config: Config = {
        navigationBarTitleText: '发布趣味答题'
    }
    constructor(props: AddAnswerFormProps) {
        super(props)
        this.state = {
            atcList: [],
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            atcDeletIcon: remoteImgPreUrl + "images/subPackageEco/redDelet.png",
            uncheckIcon: remoteImgPreUrl + "images/subPackageEco/uncheckIcon.png",
            preTypes: [

            ],
            customTypes: [
                { name: '单选题', type: '0' },
                { name: '多选题', type: '1' }
            ],
            showAddTypeCover: false, //是否显示弹层
            questions: []
        }
    }

    componentDidMount() {
        
    }

    componentDidShow() {
        this.setState({
            questions: this.props.questions
        })
    }

    // 点击已选项 进去编辑
    goEdit(index, type) {
        Taro.navigateTo({
            url: '/subPackageEco/pages/answer/addAnswerFormItem/index?index=' + index + '&type=' + type
        });
    }

    // 点击新增-显示弹层
    showAddTypeCover() {
        this.setState({
            showAddTypeCover: true
        });
    }

    // 点击弹层上的 取消 按钮
    cancelAddType() {
        this.setState({
            showAddTypeCover: false
        });
    }


    // 添加自定义项 
    addCustomTypes(name, type) {
        this.setState({
            showAddTypeCover: false,// 关闭弹窗
        });
        Taro.navigateTo({
            url: '/subPackageEco/pages/answer/addAnswerFormItem/index?placeholder=' + name + '&type=' + type
        });
    }

    // 删除已添加项
    deletAtcListItem(index, e) {
        e.stopPropagation();// 阻止冒泡
        let atcList = this.state.atcList;
        atcList.splice(index, 1);
        console.log(atcList)
        this.setState({ atcList });
        // 将删除的这一项 在弹层上的点击效果释放开来
        // ......
    }

    handleNextStep(){
        if( this.state.questions && this.state.questions.length > 0 ){
            Taro.navigateTo({
                url: '/subPackageEco/pages/answer/redBag/index'
            })
        }else{
            Taro.showToast({
                title:'至少新增一道题',
                icon:"none",
                duration:2000
            })
        }
    }


    render() {
        const { title } = this.props;
        const { atcAddIcon, customTypes, showAddTypeCover, atcDeletIcon, questions } = this.state;
        return (
            <View className='addAnswerForm-wrap'>
                <View className="addTitleCom">
                    <View className="card atcTitle">{ title }</View>
                </View>
                {/* 自定义 list */}
                <View className="customList">
                    {
                        questions && questions.map((item, index) => {
                            return (
                                <View className='option-item' onClick={this.goEdit.bind(this, index, item.type)}>
                                    <View className='title'>
                                        <Text>{ item.type == 1 ? '单选题' : '多选题' }</Text>{ index + 1 }.{ item.title }
                                        <Image className='atcDeletIcon' onClick={this.deletAtcListItem.bind(this, index)} src={ atcDeletIcon } mode="aspectFill" />
                                    </View>
                                    {
                                        item.answerList.map(option => {
                                            return (
                                                <Block>
                                                    <View className='question-item question-item--flex' >
                                                        <View className='icon icon-xuanze' style={'font-size:16px'}></View>
                                                        <Text className='info'>{ option.name }</Text>
                                                    </View>
                                                </Block>
                                            )
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                </View>

                <View className="atcList">
                    <View className="flex contentCenter active atcAddView" onClick={ this.showAddTypeCover }>
                        <Image className='atcAddIcon' src={atcAddIcon} mode="aspectFill" />
                        <Text className="atcAddTxt">点击添加题目</Text>
                    </View>
                </View>

                <View className='next-btn'>
                    <AtButton type='primary' onClick={this.handleNextStep.bind(this)}>下一步</AtButton>
                </View>
                
                {/* 配置 类别 层 */}
                <View className={`${ showAddTypeCover ? 'sysShow' : 'sysHide'}`}>
                    <View className="opacityCover" onClick={this.cancelAddType}></View>
                    <View className="atcModalCover">
                        <View className="upView">

                            <View className="atcModalTit">添加自定义项</View>
                            <View className="flex contentStart flexWrap botSpace">
                                {
                                    customTypes.map((item, index) => {
                                        return (
                                            <View className="atcBloks active" key={`custy_${index}`} 
                                            onClick={this.addCustomTypes.bind(this, item.name, item.type)}>{item.name}</View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View className="modWhiteBtn active" onClick={ this.cancelAddType }>取消</View>
                    </View>
                </View>
            </View>
        )
    }
}

export default AddVoteForm
