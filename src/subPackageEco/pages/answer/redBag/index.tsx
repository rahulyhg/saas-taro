import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Switch, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { debounce } from '../../../../utils/common'
import { RedBagAnswerProps, RedBagAnswerState } from './index.interface'
import './index.scss'
import "../../../style/formRap.scss"
const WeValidator = require('we-validator')

@connect(({ answer }) => ({
    ...answer,
}))

class RedBagAnswer extends Component<RedBagAnswerProps,RedBagAnswerState > {
    config:Config = {
        navigationBarTitleText: '发布趣味答题'
    }
    constructor(props: RedBagAnswerProps) {
        super(props)
        this.state = {
            switchValue: false,
            formList: [
                {label: '充值金额（元）', placeholder: '请输入',inputValue: ''},
                {label: '全部答对单个红包金额（元）', placeholder: '请输入',inputValue: ''},
                {label: '全部答错单个红包金额（元）', placeholder: '请输入',inputValue: ''},
                {label: '其他单个红包金额（元）', placeholder: '请输入',inputValue: ''},
                {label: '需支付金额（元）', placeholder: '请输入',inputValue: '',isShowResult: true, resultValue: 0},
            ],
        }
    }

    componentDidMount() {
        
    }

    // 切换状态 是否选红包
    switchChange(e){
        this.setState({
            switchValue: e.detail.value
        });
    }

    // 输入相关红包设置监听事件
    inputData(index, e){
        // 使用方式二，调用函数
        if(index==0 && !WeValidator.checkValue('min', e.detail.value,0.01)){
            Taro.showToast({
                title:'设置最小金额为0.01',
                duration:2000,
                icon:'none'
            })
            return ''
        }

        if(index==1 && !WeValidator.checkValue('min', e.detail.value,1)){
            Taro.showToast({
                title:'设置最小红包个数为1',
                duration:2000,
                icon:'none'
            })
            return  ''
        }
        
        const _inputValue = e.detail.value;
        let formList = this.state.formList;
        formList[index].inputValue = _inputValue;

        if(index === 0) {
            formList[formList.length - 1].resultValue = this.numberFormat(_inputValue * 1.006, 2, ".", ",", "ceil");
        }

        this.setState({
            formList
        });
    }

    numberFormat(number, decimals, dec_point, thousands_sep, roundtag) {
        /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        let n = !isFinite(+number) ? 0 : +number;
        let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        let sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        let dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
        let toFixedFix = function (n, prec) {
     
            let k = Math.pow(10, prec);
    
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
        };
        let s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        let re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }
     
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
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

    componentWillUnmount(){
        const {dispatch} = this.props;
        const {formList} = this.state;
        dispatch({
            type:'answer/updateState',
            payload:{
                redPlatform: 0,
                redTotalNum: formList[0].inputValue,
                redMoney: formList[1].inputValue,
                redTotal: formList[2].inputValue,
                redPayTotal: formList[3].inputValue,
            }
        }) 
    }

    // 发布趣味答题活动
    submitAnswer = debounce(() =>{
        const { dispatch } = this.props;
        const { formList, switchValue } = this.state;
        
        if( switchValue ) {
            dispatch({
                type: 'answer/addAnswer',
                payload:{
                    redNeed: switchValue ? '1' : '0',
                    redTotalNum: formList[0].inputValue,
                    redMoney: formList[1].inputValue,
                    redTotal: Number(formList[0].inputValue)*Number(formList[1].inputValue),
                    redPayTotal: Number(formList[0].inputValue)*Number(formList[1].inputValue)*1.006
                }
            })
        }
        
        // 发布趣味答题
        dispatch({
            type: 'answer/addAnswer',
            payload: {
                ...this.props,
                redNeed: switchValue ? '1' : '0',
            },
            callback: res => {
                if (res.code == 1) {
                    Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                        Taro.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        });
                    });
                } else {
                    Taro.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    }, 300)

    render() {
        const {switchValue, formList} = this.state;
        return (
        <View className='redBag-wrap'>
            <View className="redBagPageCom">
                <View className="flex formList">
                    <Text className="label">发放红包</Text>
                    <Switch color="#FF4D4F" checked={switchValue} onChange={this.switchChange.bind(this)}/>
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
                                formList.map((item,index)=>{
                                    return (
                                        <View className="flex formList posrel">
                                            <View className="label">{item.label}</View>
                                            {
                                                item.isShowResult ? <Text className="red size">{item.resultValue}</Text> : 
                                                <Input className="label labelInput" value={ item.inputValue } type='number' maxLength={8} 
                                                onInput={ this.inputData.bind(this, index) } placeholder={ item.placeholder }/>
                                            }
                                            
                                        </View>
                                    )
                                })
                            }
                        </Block> : null
                }

                <View className="btnContain" onClick={ this.submitAnswer.bind(this) }>
                    <View className="redBgBtn active">发布</View>
                </View>
            </View>
        </View>
        )
    }
}

export default RedBagAnswer
