import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Block, Checkbox, CheckboxGroup, Label } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AddSurveyFormProps, AddSurveyFormState } from './index.interface'
import './index.scss'
import "../../../style/formRap.scss"
const remoteImgPreUrl = process.env.remoteImgPreUrl

// import {  } from '../../components'

@connect(({ survey, preOption }) => ({
    ...survey,
    ...preOption
}))
class AddVoteForm extends Component<AddSurveyFormProps, AddSurveyFormState> {


    config: Config = {
        navigationBarTitleText: '发布调查活动'
    }
    constructor(props: AddSurveyFormProps) {
        super(props)
        this.state = {
            atcList: [],
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            atcDeletIcon: remoteImgPreUrl + "images/subPackageEco/redDelet.png",
            uncheckIcon: remoteImgPreUrl + "images/subPackageEco/uncheckIcon.png",
            preTypes: [
                { disabled: false, name: '姓名', id: '' },
                { disabled: false, name: '性别', id: '' },
                { disabled: false, name: '年龄', id: '' },
                { disabled: false, name: '手机', id: '' },
                { disabled: false, name: '学历', id: '' }
            ],
            customTypes: [
                { name: '单选题', type: '0' },
                { name: '多选题', type: '1' },
                { name: '问答题', type: '2' },
            ],
            showAddTypeCover: false, //是否显示弹层
            questions: []
        }
    }

    async componentDidMount() {
        const { dispatch } = this.props;
        await dispatch({
            type: 'preOption/getPreOptions'
        })

        this.setState({
            preTypes: this.props.preOptions
        })
    }

    componentDidShow() {
        this.setState({
            questions: this.props.questions,
            atcList: this.props.customOptions
        })
    }

    // 点击已选项 进去编辑
    goEdit(index, type) {
        Taro.navigateTo({
            url: '/subPackageEco/pages/survey/addSurveyFormItem/index?index=' + index + '&type=' + type
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

    // 添加预设选项 addPreTypes 必填
    addPreTypes(index) {
        const preTypes = this.state.preTypes;
        if (preTypes[index].disabled) {
            return; // 如果已选过，就不可以再选
        }
        let atcList = this.state.atcList;
        preTypes[index].disabled = true;// 设置已选  不能再选
        preTypes[index].must = '1';// 设置 选完显示 必填
        //atcList = atcList.concat(preTypes[index]);

        atcList.splice(index, 0, preTypes[index]);
        atcList.forEach((element,index) => {
            element.index = index;
        });

        this.setState({
            atcList,
            showAddTypeCover: false
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'survey/updateState',
            payload: {
                customOptions: atcList
            }
        })

    }

    // 添加自定义项 
    addCustomTypes(name, type) {
        this.setState({
            showAddTypeCover: false,// 关闭弹窗
        });
        Taro.navigateTo({
            url: '/subPackageEco/pages/survey/addSurveyFormItem/index?placeholder=' + name + '&type=' + type
        });
    }

    // 删除已添加项
    deletAtcListItem(item,index, e) {
        const preTypes = this.state.preTypes;
        if (item.type == '0') {
            preTypes.forEach((element, idx) => {
                if (element.name == item.name) {
                    preTypes[idx].disabled = false;
                }
            });
        }

        e.stopPropagation();// 阻止冒泡
        let atcList = this.state.atcList;
        atcList.splice(index, 1);
        console.log(atcList)
        this.setState({ atcList,preTypes });
        // 将删除的这一项 在弹层上的点击效果释放开来
        // ......
    }

    // 删除已添自定义加项
    deletCustomListItem(index, e) {
        e.stopPropagation();
        let questions = this.state.questions;
        questions.splice(index, 1);
        this.setState({ questions });
    }

    handleNextStep() {
        if ((this.state.questions && this.state.questions.length > 0)) {
            Taro.navigateTo({
                url: '/subPackageEco/pages/survey/redBag/index'
            })
        } else {
            Taro.showToast({
                title: '至少新增一个自定义选项',
                icon: "none",
                duration: 2000
            })
        }
    }


    render() {
        const { title } = this.props;
        const { atcList, atcAddIcon, preTypes, customTypes, showAddTypeCover, atcDeletIcon, questions } = this.state;
        return (
            <View className='addSurveyForm-wrap'>
                <View className="addTitleCom">
                    <View className="card atcTitle">{title}</View>
                </View>
                {/* 自定义 list */}
                <View className="atcList">
                    {
                        atcList.map((item, index) => {
                            return (
                                <View className="flex card atcListItem" key={`atclist ${index}`}>
                                    <View className="flex contentStart">
                                        <View className={item.must == '1' ? 'red' : 'white'}>*</View>{item.name}
                                    </View>
                                    <Image className='atcDeletIcon' onClick={this.deletAtcListItem.bind(this,item, index)} src={atcDeletIcon} mode="aspectFill" />
                                </View>
                            )
                        })
                    }

                    

                </View>

                <View className="customList">
                    {
                        questions && questions.map((item, index) => {
                            return (
                                <View className='option-item' onClick={this.goEdit.bind(this, index, item.type)}>
                                    <View className='title at-row'>
                                        <View className='at-col'><Text>{item.type == '0' ? '单选题' : (item.type == '1' ? '多选题' : '问答题')}</Text>{index + 1}.{item.title}</View>
                                        
                                        <Image className='atcDeletIcon' onClick={this.deletCustomListItem.bind(this, index)} src={atcDeletIcon} mode="aspectFill" />
                                    </View>
                                    {
                                        item.answerList && item.answerList.map(element => {
                                            return (
                                                <Block>
                                                    <View className='question-item question-item--flex' >
                                                        <View className='icon icon-xuanze' style={'font-size:16px'}></View>
                                                        <Text className='info'>{element.name}</Text>
                                                    </View>
                                                    {
                                                        element.type == '1' && <View className='other-input'><Input placeholder='请输入' /></View>
                                                    }
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
                    <View className="flex contentCenter active atcAddView" onClick={this.showAddTypeCover}>
                        <Image className='atcAddIcon' src={atcAddIcon} mode="aspectFill" />
                        <Text className="atcAddTxt">点击添加调查选项</Text>
                    </View>
                </View>

                <View className='next-btn'>
                    <AtButton type='primary' onClick={this.handleNextStep.bind(this)}>下一步</AtButton>
                </View>

                {/* 配置 类别 层 */}
                <View className={`${showAddTypeCover ? 'sysShow' : 'sysHide'}`}>
                    <View className="opacityCover" onClick={this.cancelAddType}></View>
                    <View className="atcModalCover">
                        <View className="upView">
                            <View className="atcModalTit">添加预设选项</View>
                            <View className="flex contentStart flexWrap">
                                {
                                    preTypes.map((item, index) => {
                                        return (
                                            <View className={`atcBloks ${item.disabled ? 'disabled' : 'active'}`}
                                                key={`prety_${index}`} onClick={this.addPreTypes.bind(this, index)}>{item.name}</View>
                                        )
                                    })
                                }
                            </View>
                            <View className="atcModalTit">添加自定义项</View>
                            <View className="flex contentStart flexWrap botSpace">
                                {
                                    customTypes.map((item, index) => {
                                        return (
                                            <View className="atcBloks active"
                                                key={`custy_${index}`} onClick={this.addCustomTypes.bind(this, item.name, item.type)}>{item.name}</View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View className="modWhiteBtn active" onClick={this.cancelAddType}>取消</View>
                    </View>
                </View>
            </View>
        )
    }
}

export default AddVoteForm
