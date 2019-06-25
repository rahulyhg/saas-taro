import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Text } from '@tarojs/components'
import { AddFormItemProps, AddFormItemState } from './index.interface'
import { connect } from '@tarojs/redux'
const remoteImgPreUrl = process.env.remoteImgPreUrl
import './index.scss'
import "../../../style/formRap.scss"

@connect(({ answer }) => ({
    ...answer
}))

class AddFormItem extends Component<AddFormItemProps, AddFormItemState> {
    config: Config = {
        navigationBarTitleText: '发布趣味问答'
    }
    constructor(props: AddFormItemProps) {
        super(props)
        this.state = {
            grayDelet: remoteImgPreUrl + "images/subPackageEco/grayDelet.png",
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            placeholder: '',
            addOtherDisabled: false,
            question: {
                id: '',
                type: '',
                title: '',
                answerList: []
            }
        }
    }

    componentDidMount() {
        if (this.$router.params.index) {
            const { questions } = this.props;
            this.setState({
                question: questions[this.$router.params.index]
            });
        } else {
            const placeholder = this.$router.params.placeholder;
            const type = this.$router.params.type;
            this.setState({
                placeholder: placeholder ? placeholder : '',
                question: {
                    ...this.state.question,
                    type: type
                }
            });
        }

    }

    // 添加选项
    addOption() {
        let { answerList } = this.state.question;
        const code = answerList.length;
        answerList.push({
            code: code.toString(),
            name: '',
            type: 'I',
            right: 0
        })
        this.setState({
            question: {
                ...this.state.question,
                answerList
            }
        })
    }


    inputTitle(e) {
        this.setState({
            question: {
                ...this.state.question,
                title: e.detail.value
            }
        });
    }

    // 输入提示语监听
    inputOptionName(index, e) {

        const inputValue = e.detail.value;
        let { answerList } = this.state.question;
        answerList[index].name = inputValue;
        this.setState({
            question: {
                ...this.state.question,
                answerList
            }
        });
    }

    // 删除选项 
    deleteOption(index, e) {
        e.stopPropagation();// 阻止冒泡
        let { answerList } = this.state.question;
        answerList.splice(index, 1);
        this.setState({
            question: {
                ...this.state.question,
                answerList
            }
        });

    }

    // 点击 保存
    saveEvt() {
        const { question } = this.state;
        const { answerList } = question;
        // 校验为空
        if( !question.title ) {
            Taro.showToast({
                title: `请输入${this.state.placeholder}标题`,
                icon: 'none',
                duration: 2000
            });

            return false;
        }

        if( !answerList || answerList.length <= 0) {
            Taro.showToast({
                title: `请增加选项`,
                icon: 'none',
                duration: 2000
            });

            return false;
        }

        for(let i = 0;i<answerList.length;i++) {
            if( !answerList[i].name ) {
                Taro.showToast({
                    title: `选项不也能为空`,
                    icon: 'none',
                    duration: 2000
                });
    
                return false;
            }
        }

        let rightNum = 0;
        answerList.map(answer => {
            rightNum += answer.right;
        });

        if( !rightNum ) {
            Taro.showToast({
                title: `至少设置一个正确答案`,
                icon: 'none',
                duration: 2000
            });

            return false;
        } 

        let { questions, dispatch } = this.props;
        if (this.$router.params.index) {
            questions.splice(this.$router.params.index, 1, question)
        } else {
            questions.push(question)
        }
        dispatch({
            type: 'answer/updateState',
            payload: {
                questions
            }
        })
        Taro.navigateBack({
            delta: 1
        })
    }

    // 点击 删除
    deletEvt() {
        let { questions, dispatch } = this.props;
        if (this.$router.params.index) {
            questions.splice(this.$router.params.index, 1)
            dispatch({
                type: 'answer/updateState',
                payload: {
                    questions
                }
            })
        }
        
        Taro.navigateBack({
            delta: 1
        })
    }

    // 设为正确答案
    handleAsRight(index) {
        let { answerList } = this.state.question;
        let { type } = this.state.question;
        if (type === '0') {
            answerList.forEach((element, idx) => {
                if (index === idx) {
                    element.right = 1;
                } else {
                    element.right = 0;
                }
            });
        } else {
            answerList.forEach((element, idx) => {
                if(idx === index) {
                    element.right = element.right == 1 ? 0 : 1;
                }
            });
        }
        this.setState({
            question: {
                ...this.state.question,
                answerList: answerList
            }
        })

    }
    render() {
        const { grayDelet, placeholder, atcAddIcon, question } = this.state;
        return (
            <View className='addFormItem-wrap'>

                <View className="posrel formList">
                    <Input className="label labelInput" value={ question.title } type='text' maxLength={80} onInput={ this.inputTitle.bind(this) }
                        placeholder={`请输入${placeholder}标题`} focus />
                </View>
                {
                    question.answerList && question.answerList.map((element, index) => {
                        return (

                            <View className="posrel formList">
                                <View>
                                    <Input className="label labelInput" value={ element.name } type='text' maxLength={80} onInput={this.inputOptionName.bind(this, index)}
                                        placeholder={`请输入${ placeholder }选项`} focus />
                                    <Image className='grayDeletIcon active' src={ grayDelet } mode="aspectFill"
                                        onClick={ this.deleteOption.bind(this, index) } />
                                </View>
                                <View className='form-item flex action' onClick={ this.handleAsRight.bind(this, index) }>
                                    <View className={`icon icon-zhengque ${element.right == 1 ? 'icon-active' : ''}`} ></View>
                                    <Text className={`flex-item ${element.right == 1 ? 'icon-active' : ''}`}>设为正确答案</Text>
                                </View>
                            </View>

                        )
                    })
                }
                
                <View className='flex addAction-wrap'>
                    <View className='flex-item van-hairline--right' onClick={ this.addOption.bind(this) }>
                        <Image className='atcAddIcon' src={ atcAddIcon } mode="aspectFill" />
                        <Text className="atcAddTxt">增加选项</Text>
                    </View>

                </View>


                <View className="btnContain">
                    <View className="redBgBtn" onClick={this.saveEvt}>保存</View>
                    {
                        // 如果 是从 新增自定义项目 跳过来的（placeholder有值的时候） 才显示删除按钮，
                        !placeholder && <View className="whiteBgBtn" onClick={ this.deletEvt.bind(this) }>删除</View>
                    }

                </View>
            </View>
        )
    }
}

export default AddFormItem
