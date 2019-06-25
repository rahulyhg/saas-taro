import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, RadioGroup, Radio, Label, CheckboxGroup, Checkbox } from '@tarojs/components'
import { AtInput, AtTextarea, AtImagePicker, AtIcon } from "taro-ui";
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { IFormDetailObj } from './index.interface'
import './index.scss'
import { element } from 'prop-types';

interface ISubProps {
    formItem: IFormDetailObj;
}
interface IState {
    initValue?: any;
    value?: any;
    onChange?: (e) => void;
    showOtherInput?: boolean;
}
class FormRadioObjitem extends Component<ISubProps, IState> {

    config = {
        navigationBarTitleText: ""
    };

    constructor(props: ISubProps) {
        super(props)
    }

    componentWillMount() {
        console.log(this.props);
        const { formItem } = this.props
        this.state = {
            onChange: formItem.onChange
        }
    }

    componentDidMount() {
    }

    onInputChange = (e) => {
        const { onChange } = this.state
        this.setState({
            value: e.detail.value
        })
        if (onChange) {
            onChange(e)
        }
    }

    onPickerChange = (e) => {
        const { onChange } = this.state
        const { formItem } = this.props

        if (formItem.config) {
            const item = formItem.config.find(item => item.id === e.detail.value)
            if (item) {
                this.setState({
                    value: item.value
                })
            }
        }

        if (onChange) {
            onChange(e)
        }
    }

    onRadioChange = (e) => {
        const { onChange } = this.state
        this.setState({
            showOtherInput: JSON.parse(e.detail.value).value == '其他__'
        })
        if (onChange) {
            onChange(e)
        }
    }

    onCheckboxChange = (e) => {
        const { onChange } = this.state;
        const list = e.detail.value;

        let findIndex = -1;
        list.forEach((element, index) => {
            if (JSON.parse(element).value == '其他__') {
                findIndex = index;
                this.setState({
                    showOtherInput: true
                })
            }
        })

        this.setState({
            showOtherInput: (findIndex > -1)
        })


        if (onChange) {
            onChange(e)
        }
    }

    onImageChange = (files, operationType, index) => {
    }

    onImageClick = (index, file) => {
    }

    onImageFail = (msg) => {
    }

    /** 触发其他选项中的事件 */
    onOtherChange = (onOtherChange, e) => {
        if (onOtherChange) {
            onOtherChange(e)
        }
    }

    render() {
        const { formItem } = this.props
        const { value, initValue, showOtherInput } = this.state
        const config = formItem ? formItem.config : { type: '' }

        if (formItem && formItem.type === 'textarea') {
            return (
                <AtTextarea
                    placeholder='请输入'
                    maxLength={config ? config.maxLength : 200}
                    value={value || initValue}
                    onChange={this.onInputChange.bind(this)}
                />
            )
        }
        if (formItem && formItem.type === 'radio') {

            return (
                <RadioGroup className="radioGroup" onChange={this.onRadioChange.bind(this)}>
                    {
                        config && config.map(radio => {
                            return (
                                <View>
                                    <Label key={radio.id} className="radio">
                                        <Radio style='width: 58rpx;height: 48rpx;' color='#FF4D4F' value={JSON.stringify(radio)} />
                                        <View>
                                            <Text style={{wordBreak:'break-all',wordWrap:'break-word'}}>{radio.value}</Text>
                                        </View>
                                    </Label>
                                    {
                                        radio.hasInput ?
                                            <AtInput
                                                border={false}
                                                className={showOtherInput ? 'show' : 'hide'}
                                                name={formItem.typeName}
                                                placeholder='请输入'
                                                onChange={this.onOtherChange.bind(this, radio.onOtherChange)}
                                            />
                                            : ''
                                    }
                                </View>
                            )
                        })
                    }
                </RadioGroup>
            )
        }
        if (formItem && formItem.type === 'checkbox') {
            return (
                <CheckboxGroup className="checkboxGroup" onChange={this.onCheckboxChange}>
                    {
                        config && config.map(radio => {
                            return (
                                <View>
                                    <Label key={radio.id} className="checkbox">
                                        <Checkbox value={JSON.stringify(radio)} />
                                        <View>
                                            <Text  style={{wordBreak:'break-all',wordWrap:'break-word'}}>{radio.value}</Text>
                                        </View>
                                    </Label>
                                    {
                                        radio.hasInput ?
                                            <AtInput
                                                border={false}
                                                className={showOtherInput ? 'show' : 'hide'}
                                                name={formItem.typeName}
                                                placeholder='请输入'
                                                onChange={this.onOtherChange.bind(this, radio.onOtherChange)}

                                            />
                                            : ''
                                    }
                                </View>
                            )
                        })
                    }
                </CheckboxGroup>
            )
        }
        return (
            <View>没有对应type</View>
        )
    }
}

export default FormRadioObjitem
