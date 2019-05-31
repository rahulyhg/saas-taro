import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtButton, AtIcon } from "taro-ui";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { SurveyDetailProps, SurveyDetailState } from './index.interface'
import './index.scss'
import Dimage from '../../../../pages/common/dimage'
import _lodash from 'underscore';
import { element } from 'prop-types';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';
@connect(({ surveyJoin }) => ({
    ...surveyJoin,
}))
class SurveyDetail extends Component<SurveyDetailProps, SurveyDetailState> {
    config: Config = {
        navigationBarTitleText: '调查'
    }
    constructor(props: SurveyDetailProps) {
        super(props)

    }

    async componentDidMount() {
        const _this = this;
        const { dispatch } = this.props;
        await dispatch({
            type: 'surveyJoin/getMyPartakeDetail',
            payload: { id: this.$router.params.id }
        })

    }


    render() {
        const { title, createByName, createByCover, startTime, endTime, customOptions, questions } = this.props;
        const startDate = startTime ? startTime.substring(0, 10) : '';
        const endDate = endTime ? endTime.substring(0, 10) : '';



        return (
            <View className='surveyDetail-wrap'>
                <View className="header">
                    <View className="userInfo">
                        <View>
                            <View className='user-photo'><Dimage type='avatar' src={createByCover} /></View>
                            <Text className="label">发起投票者：</Text>
                            <Text className="name">{createByName}</Text>
                        </View>
                        <AtIcon prefixClass="icon icon-zhuanfa1" value='chevron-down' size='14' color='rgba(153, 153, 153, 1)' />
                    </View>
                    <View className="activityName">{title}</View>
                    <View className="activityTime">{startDate}-{endDate}</View>
                </View>

                <AtForm>
                    {/* 预设表单 */}
                    <View className="presetForm">
                        {
                            customOptions && customOptions.map(formItem => {
                                return (
                                    <View key={formItem.id} className="formItem">
                                        <View className="formLabel">
                                            <Text className={formItem.must == '1' ? 'red' : 'white'}>*</Text>{formItem.name}
                                        </View>
                                        <View className="formContent">
                                            {formItem.value}
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>

                    {/* 单选/多选表单 */}
                    <View className="customForm">
                        {
                            questions && questions.map(formItem => {
                                return (
                                    <View key={formItem.typeName} className="formItem custom">
                                        <View className='formLabel'>
                                            <Text className={formItem.must == '1' ? 'red' : 'white'}>*</Text>
                                            {
                                                formItem.type === '2' ? <Text className='type'>问答</Text> : (formItem.type === '0' ? <Text className='type'>单选</Text> : <Text className='type'>多选</Text>)
                                            }
                                            {formItem.title}
                                        </View>
                                        <View className='formContent'>
                                            {

                                                (formItem.type == '0' || formItem.type == '1') ? formItem.answerList.map(item => (
                                                    <View className='at-row van-hairline--bottom'>
                                                        <Image src={item.isChoose ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;padding-right:12px;'} />
                                                        <View className='at-col' >
                                                            <View>{item.name}</View>
                                                            {
                                                                item.type == '1' && item.value && <View>{item.value}</View>
                                                            }
                                                        </View>
                                                    </View>
                                                ))
                                               :<View className="formContent">
                                                    {formItem.answerValue}
                                                </View>

                                            }

                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                </AtForm>
            </View>
        )
    }
}

export default SurveyDetail
