import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AddActFormProps, AddActFormState } from './index.interface'
import './index.scss'
import "../../../style/formRap.scss"
const remoteImgPreUrl = process.env.remoteImgPreUrl

 import _lodash from 'underscore'

@connect(({ activity, addActForm, preOption }) => ({
    ...addActForm,
    title: activity.title,
    ...preOption
}))

class AddActForm extends Component<AddActFormProps, AddActFormState> {
    config: Config = {
        navigationBarTitleText: '发布活动'
    }
    constructor(props: AddActFormProps) {
        super(props)
        this.state = {
            ...this.state,
            atcList: [],
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            atcDeletIcon: remoteImgPreUrl + "images/subPackageEco/redDelet.png",
            preTypes: [
                { disabled: false, typeName: '姓名' },
                { disabled: false, typeName: '性别' },
                { disabled: false, typeName: '年龄' },
                { disabled: false, typeName: '手机' },
                { disabled: false, typeName: '学历' }
            ],
            customTypes: [
                { name: '单行文本', num: 5 },
                { name: '多行文本', num: 1 },
                { name: '图片上传', num: 3 },
            ],
            showAddTypeCover: false, //是否显示弹层
        }
    }

    async componentDidMount() {
        const { dispatch } = this.props;
        await dispatch({
            type: 'preOption/getPreOptions'
        })


        const { atcList, preOptions } = this.props;
        atcList.forEach(item => {
            if (item.type == '0') {
                preOptions.forEach(obj => {
                    if (obj.name == item.name) {
                        obj.disabled = true;
                    }
                })
            }
        })
        this.setState({
            preTypes: preOptions
        })

    }

    componentDidShow() {
        let inputNum = 5;
        let textNum = 1;
        let imgNum = 3;
        this.props.atcList.forEach(item => {
            if (item.type == '1') {
                if (item.optionType == '0') {
                    inputNum--;
                } else if (item.optionType == '1') {
                    textNum--;
                } else {
                    imgNum--
                }
            }

        })
        this.setState({
            atcList: this.props.atcList,
            customTypes: [
                { name: '单行文本', num: inputNum },
                { name: '多行文本', num: textNum },
                { name: '图片上传', num: imgNum },
            ],
        })
    }

    // 点击已选项 进去编辑
    goEdit(item) {
        if (item.type == '0') {
            return false;
        }

        this.props.dispatch({
            type: 'addActForm/updateState',
            payload: {
                optionItem: item
            }
        })
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/addActTypesForm/index?isEdit=1'
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
        preTypes[index].isMind = true;// 设置 选完显示 必填
        atcList.splice(index, 0, {
            type: '0',
            optionType: '0',
            name: preTypes[index].name,
            id: preTypes[index].id,
            must: '1'
        });
        atcList.forEach((element, index) => {
            element.index = index;
        });

        this.setState({
            atcList,
            showAddTypeCover: false
        }, () => {
            // 在这个函数内你可以拿到 setState 之后的值
            console.log(this.state.atcList);
            const { dispatch } = this.props;
            dispatch({
                type: 'addActForm/updateState',
                payload: {
                    atcList: this.state.atcList
                }
            })
        });

    }

    // 添加自定义项 
    addCustomTypes(name, num) {
        if (num <= 0) {
            return false;
        }
        this.setState({
            showAddTypeCover: false,// 关闭弹窗
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'addActForm/updateState',
            payload: {
                optionItem: {}
            }
        })
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/addActTypesForm/index?isEdit=0&placeholder=' + name
        });
    }

    // 删除已添加项
    deletAtcListItem(item, index, e) {
        const { preTypes, customTypes } = this.state;
        if (item.type == '0') {
            preTypes.forEach((element, idx) => {
                if (element.name == item.name) {
                    preTypes[idx].disabled = false;
                }
            });
        } else {
            if (item.optionType == '0') {
                customTypes[0].num = customTypes[0].num + 1;
            } else if (item.optionType == '1') {
                customTypes[1].num = customTypes[1].num + 1;
            } else {
                customTypes[2].num = customTypes[2].num + 1;
            }
        }
        e.stopPropagation();// 阻止冒泡
        let atcList = this.state.atcList;
        atcList.splice(index, 1);
        console.log(atcList)
        this.setState({ atcList, preTypes, customTypes });
        // 将删除的这一项 在弹层上的点击效果释放开来
        // ......

    }

    // 发布活动
    onSubmit = _lodash.debounce(()=> {
        const { dispatch } = this.props;
        dispatch({
            type: 'activity/addActivity',
            payload: {
                atcList: this.state.atcList
            }
        })
    },500)

    render() {
        const { atcList, atcAddIcon, atcDeletIcon, preTypes, customTypes, showAddTypeCover } = this.state;
        const { title } = this.props

        return (
            <View className='addActForm-wrap'>
                <View className="addTitleCom">
                    <View className="card atcTitle">{title}</View>
                </View>

                <View className="atcList">
                    {
                        atcList.map((item, index) => {
                            return (
                                <View className="flex card atcListItem" key={`atclist ${index}`}
                                    onClick={this.goEdit.bind(this, item)}>
                                    <View className="flex contentStart">
                                        <View className={item.must === '1' ? 'red' : 'white'}>*</View>{item.name}
                                    </View>
                                    <Image className='atcDeletIcon' onClick={this.deletAtcListItem.bind(this, item, index)} src={atcDeletIcon} mode="aspectFill" />
                                </View>
                            )
                        })
                    }
                    <View className="flex contentCenter active atcAddView" onClick={this.showAddTypeCover}>
                        <Image className='atcAddIcon' src={atcAddIcon} mode="aspectFill" />
                        <Text className="atcAddTxt">点击添加报名选项</Text>
                    </View>
                </View>


                <View className="pageBotBtnComSpace"></View>
                <View className="pageBotBtnCom">
                    {
                        atcList.length > 0 ? <View data-s={atcList.length} className='pageBotBtn active' onClick={this.onSubmit}>发布活动</View>
                            : <View data-s={atcList.length} className='pageBotBtn disableBtn'>发布活动</View>
                    }

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
                                            <View className={`atcBloks ${item.num <= 0 ? 'disabled' : 'active'}`}
                                                key={`custy_${index}`} onClick={this.addCustomTypes.bind(this, item.name, item.num)}>
                                                {item.name}<Text className="gray">({item.num})</Text>
                                            </View>
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

export default AddActForm
