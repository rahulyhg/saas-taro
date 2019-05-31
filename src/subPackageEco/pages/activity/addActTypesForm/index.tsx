import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Switch, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AddActTypesFormProps, AddActTypesFormState } from './index.interface'
const remoteImgPreUrl = process.env.remoteImgPreUrl
import './index.scss'
import "../../../style/formRap.scss"
// import {  } from '../../components'

@connect(({ addActForm }) => ({
    ...addActForm,
}))

class AddActTypesForm extends Component<AddActTypesFormProps, AddActTypesFormState> {
    config: Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: AddActTypesFormProps) {
        super(props)
        this.state = {
            ...this.state,
            grayDelet: remoteImgPreUrl + "images/subPackageEco/grayDelet.png",
            placeholder: '',
            optionItem: {
                ...this.state.optionItem,
                must: '0'
            }
        }
    }

    componentDidMount() {
        //const pageParams = this.$router.params.pageParams ? JSON.parse(this.$router.params.pageParams) : null;
        const placeholder = this.$router.params.placeholder;
        console.log(placeholder);
        this.setState({
            optionItem: this.props.optionItem,
            placeholder: placeholder ? placeholder : ''
        });
    }

    // 输入 提示语监听
    inputTitle(e) {
        this.setState({
            optionItem: {
                ...this.state.optionItem,
                name: e.detail.value
            }
        });
    }

    // 清空 用户输入的内容
    deletInputTitle(e) {
        e.stopPropagation();// 阻止冒泡
        this.setState({
            optionItem: {
                ...this.state.optionItem,
                name: ''
            }
        });
    }

    // 切换 是否必填项
    switchChange(e) {
        this.setState({
            optionItem: {
                ...this.state.optionItem,
                must: e.detail.value ? '1' : '0'
            }
        });
    }

    // 点击 保存
    saveEvt() {
        const { optionItem } = this.state;
        const { atcList, dispatch } = this.props;
        optionItem.type = '1';
        optionItem.optionType = this.state.placeholder === '单行文本' ? '0' : (this.state.placeholder === '多行文本' ? '1' : '2');
        if (this.$router.params.isEdit === '1') {
            atcList.splice(optionItem.index, 1, optionItem);
        } else {
            optionItem.index = atcList.length;
            atcList.push(optionItem);
        }
        dispatch({
            type: 'addActForm/updateState',
            payload: {
                atcList: atcList
            }
        })
        Taro.navigateBack({
            delta: 1
        });
    }

    // 点击 删除
    deletEvt() {
        const { optionItem } = this.state;
        const { atcList } = this.props;
        atcList.splice(optionItem.index, 1);
        this.props.dispatch({
            type: 'addActForm/updateState',
            payload: {
                atcList: atcList
            }
        })
        Taro.navigateBack({
            delta: 1
        });
    }

    render() {
        const { grayDelet, placeholder, optionItem } = this.state;
        const isMust = optionItem && optionItem.must === '1'
        return (
            <View className='addActTypesForm-wrap'>
                <View className="posrel formList">
                    <Input className="label labelInput" value={optionItem.name} type='text' maxLength={80} onInput={this.inputTitle}
                        placeholder={`请输入${placeholder}提示语`} focus />
                    <Image className='grayDeletIcon active' src={grayDelet} mode="aspectFill"
                        onClick={this.deletInputTitle} />
                </View>
                <View className="flex formList">
                    <Text className="label">是否必填项</Text>
                    <Switch color="#FF4D4F" checked={isMust} onChange={this.switchChange} />
                </View>
                <View className="btnContain">
                    <View className="redBgBtn" onClick={this.saveEvt}>保存</View>
                    {
                        // 如果 是从 新增自定义项目 跳过来的（placeholder有值的时候） 才显示删除按钮，
                        placeholder ? null : <View className="whiteBgBtn" onClick={this.deletEvt}>删除</View>
                    }
                </View>
            </View>
        )
    }
}

export default AddActTypesForm
