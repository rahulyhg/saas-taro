import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, RadioGroup, Radio, Label } from '@tarojs/components'
import { AtInput, AtTextarea, AtImagePicker, AtIcon } from "taro-ui";
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { IFormObj } from './index.interface'
import './index.scss'

interface ISubProps {
    formItem: IFormObj;
}
interface IState {
    initValue?: any;
    value?: any;
    onChange?: (e) => void;
}
class FormObjItem extends Component<ISubProps, IState> {

    config = {
        navigationBarTitleText: ""
    };

    constructor(props: ISubProps) {
        super(props)
    }

    componentWillMount() {
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
            value: e
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
        if (onChange) {
            onChange(e.detail.value)
        }
    }

    onImageChange = (files, operationType, index) => {
    }

    onImageClick = (index, file) => {
    }

    onImageFail = (msg) => {
    }

    render() {
        const { formItem } = this.props
        const { value, initValue } = this.state
        const typeName = formItem && formItem.typeName ? formItem.typeName : ''
        const placeholder = formItem && formItem.placeholder ? formItem.placeholder : ''
        const initValue_f = formItem && formItem.initValue ? formItem.initValue : ''
        const config = formItem ? formItem.config : null
        const maxLength = config && config.maxLength ? config.maxLength : 200

        if (formItem && formItem.type === 'input') {
            return (
                <AtInput
                    border={false}
                    className="input"
                    name={typeName}
                    type='text'
                    placeholder={placeholder}
                    value={value || initValue_f}
                    onChange={this.onInputChange.bind(this)}
                />
            )
        }
        if (formItem && formItem.type === 'textarea') {
            return (
                <AtTextarea
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value || initValue_f}
                    onChange={this.onInputChange.bind(this)}
                />
            )
        }
        if (formItem && formItem.type === 'picker') {
            return (
                <Picker mode='selector' value={0} range={config} rangeKey="value" onChange={this.onPickerChange}>
                    <View className='at-row at-row__justify--between'>
                        <View className='left'>{value || initValue || placeholder}</View>
                        <View className='right'><AtIcon value='chevron-down' size='18' color='#DDDDDD' /></View>
                    </View>
                </Picker>
            )
        }
        if (formItem && formItem.type === 'radioGroup') {
            return (
                <RadioGroup className="radioGroup" onChange={this.onRadioChange}>
                    {
                        config && config.map(radio => {
                            return (
                                <Label key={radio.id} className="radio">
                                    <Radio color='#FF4D4F' value={radio.id} />
                                    <Text>{radio.value}</Text>
                                </Label>
                            )
                        })
                    }
                </RadioGroup>
            )
        }
        if (formItem && formItem.type === 'image') {
            return (
                <AtImagePicker
                    count={1}
                    multiple={false}
                    files={value || initValue}
                    onChange={this.onImageChange.bind(this)}
                    onImageClick={this.onImageClick.bind(this)}
                    onFail={this.onImageFail.bind(this)}
                />
            )
        }
        return (
            <View>没有对应type</View>
        )
    }
}

export default FormObjItem
