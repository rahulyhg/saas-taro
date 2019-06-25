import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Switch, Block ,Input} from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { RedBagProps, RedBagState } from './index.interface'
import './index.scss'
import "../../../style/formRap.scss"
// import {  } from '../../components'
const WeValidator = require('we-validator')
@connect(({ survey }) => ({
    ...survey,
}))

class RedBag extends Component<RedBagProps, RedBagState> {
    config: Config = {
        navigationBarTitleText: '发布调查活动'
    }
    constructor(props: RedBagProps) {
        super(props)
        this.state = {
            switchValue: false,
            formList: [
                { label: '红包数量', placeholder: '请输入', inputValue: '',type:'number' },
                { label: '单个金额（元）', placeholder: '请输入', inputValue: '' ,type:'digit'},
                { label: '合计金额（元）', placeholder: '请输入', inputValue: '', isShowResult: true, resultValue: 0 ,type:'text'},
                { label: '支付金额合计（元）', placeholder: '请输入', inputValue: '', isShowResult: true, resultTotalValue: 0 ,type:'text'},
            ],
        }
    }

    componentDidMount() {

    }

    componentDidShow() {
        let { formList } = this.state;
        formList[0].inputValue = this.props.redTotalNum;
        formList[1].inputValue = this.props.redMoney;
        formList[2].inputValue = this.props.redTotal;
        formList[3].inputValue = this.props.redPayTotal;
        this.setState({
            formList: formList,
            switchValue: this.props.redNeed == '1'
        })
    }

    // 切换状态 是否选红包
    switchChange(e) {
        console.log(e)
        this.setState({
            switchValue: e.detail.value
        });
    }

    // 输入相关红包设置监听事件
    inputData(index, e) {
        // 使用方式二，调用函数
        if (index == 0 && !WeValidator.checkValue('min', e.detail.value, 0.01)) {
            Taro.showToast({
                title: '设置最小金额为0.01',
                duration: 2000,
                icon: 'none'
            })
            return ''
        }

        if (index == 1 && !WeValidator.checkValue('min', e.detail.value, 1)) {
            Taro.showToast({
                title: '设置最小红包个数为1',
                duration: 2000,
                icon: 'none'
            })
            return ''
        }

        const _inputValue = e.detail.value;

        let formList = this.state.formList;
        formList[index].inputValue = _inputValue;

        if (formList[0].inputValue != '' && formList[1].inputValue != '') {
            formList[2].resultValue = Number(formList[0].inputValue) * Number(formList[1].inputValue);
            formList[3].resultValue = (Math.ceil(Number(formList[0].inputValue) * Number(formList[1].inputValue) * 1.006 * 1000) / 1000).toFixed(2)
        }

        this.setState({
            formList
        });

    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        const { formList } = this.state;
        dispatch({
            type: 'survey/updateState',
            payload: {
                redPlatform: 0,
                redTotalNum: formList[0].inputValue,
                redMoney: formList[1].inputValue,
                redTotal: formList[2].resultValue,
                redPayTotal: formList[3].resultValue,
            }
        })
    }

    // 发布调查活动
    submitSurvey = () => {
        const { dispatch } = this.props;
        const { formList, switchValue } = this.state;

        dispatch({
            type: 'survey/addSurvey',
            payload: {

                redNeed: switchValue ? '1' : '0',
                redTotalNum: switchValue ? Number(formList[0].inputValue) : 0,
                redMoney: switchValue ? Number(formList[1].inputValue) : 0,
                redTotal: switchValue ? Number(formList[0].inputValue) * Number(formList[1].inputValue) : 0,
                redPayTotal: switchValue ? (Math.ceil(Number(formList[0].inputValue) * Number(formList[1].inputValue) * 1.006 * 1000) / 1000).toFixed(2) : 0
            }
        })
        console.log(this.props)
    }

    render() {
        const { switchValue, formList } = this.state;
        return (
            <View className='redBag-wrap redBagPageCom'>
                <View className="redBagPageCom">
                    <View className="flex formList">
                        <Text className="label">发放红包</Text>
                        <Switch color="#FF4D4F" checked={switchValue} onChange={this.switchChange.bind(this)} />
                    </View>
                    {
                        switchValue ?
                            <Block>
                                <View>
                                    <View className="flex contentStart mindTxt"><View className="mindIcon">i</View>微信红包重要提示</View>
                                    <View className="smTextsPad">
                                        <View className="smTexts">1.由于充值渠道为微信，所以参与者只能在微信终端上领取红包。</View>
                                        <View className="smTexts">2.由于微信平台需抽取千分之六手续费，所以实际充值金额会增加千分之六的费用。</View>
                                        <View className="smTexts">3.未发完的红包额，将在活动结束后1个工作日内原路退回。</View>
                                        <View className="smTexts">4.红包充值金额不可开具发票，请谨慎充值。</View>
                                    </View>
                                </View>
                                {
                                    formList.map((item, index) => {
                                        return (
                                            <View className="flex formList posrel">
                                                <View className="label">{item.label}</View>
                                                {
                                                    item.isShowResult ? <Text className="red size">{item.resultValue}</Text> :
                                                        <Input className="label labelInput" value={item.inputValue} type={item.type} maxLength={8}
                                                            onInput={this.inputData.bind(this, index)} placeholder={item.placeholder} />
                                                }

                                            </View>
                                        )
                                    })
                                }
                            </Block> : null
                    }
                    {/* 发布按钮 */}
                    <View className="btnContain" onClick={this.submitSurvey}><View className="redBgBtn active">发布</View></View>
                </View>
            </View>
        )
    }
}

export default RedBag
