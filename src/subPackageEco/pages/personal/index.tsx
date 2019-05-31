import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text  } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { PersonalProps, PersonalState } from './index.interface'

import { AtTextarea } from 'taro-ui'
import './index.scss'
// import {  } from '../../components'

// @connect(({ personal }) => ({
//     ...personal,
// }))

class Personal extends Component<PersonalProps, PersonalState> {
    config: Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: PersonalProps) {
        super(props)
        this.state = {
            isShowCommentTextarea: false
        }
    }

    componentDidMount() {

    }

    handleChange() {

    }

    handleCommentTextrea() {
        this.setState({
            isShowCommentTextarea: !this.state.isShowCommentTextarea
        });
    }

    render() {
        return (
            <View className='personal'>
                <View className='personal-info at-row'>
                    <View className='at-col at-col-3'>
                        <View className="personal-info-head">
                            <Image
                                src=''
                                mode='aspectFit'
                                onError={e => {
                                    console.warn("imgError", e);
                                }}
                                className='headerimg-large'
                            />
                            <View className='personal-info-identity'>管理员</View>
                        </View>
                    </View>
                    <View className='at-col at-col-9'>
                        <View className='at-row personal-info-main'>
                            <View className='at-col at-col-6'>
                                <View className='personal-info-username'>张明</View>
                            </View>
                            <View className='at-col at-col-6'>
                                <View className='personal-info-commen'>浩鲸科技支部</View>
                            </View>
                        </View>

                        <View className='at-row'>
                            <View className='at-col at-col-6'>
                                <View className='personal-info-commen'>
                                    <Text className="text-h3">200</Text> 活跃值
                                </View>
                            </View>
                            <View className='at-col at-col-6'>
                                <View className='personal-info-commen'>
                                    <Text className="text-h3">300</Text> 个赞
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='personal-item'>
                    <View className='personal-item-header at-row'>
                        <View className='at-col at-col-2'>
                            <Image
                                src=''
                                mode='aspectFit'
                                onError={e => {
                                    console.warn("imgError", e);
                                }}
                                className='headerimg'
                            />
                        </View>
                        <View className='at-col at-col-10'>
                            <View className='username'>张明</View>
                            <View className='publictime'>2019-04-27 14:20</View>
                        </View>
                    </View>
                    <View className='personal-item-content'>
                        <View className='personal-item-content-text'>
                            习近平总书记强调，要不断增强党的政治领导力、思想引领力、群众组织力、
                            社会号召力，确保我们党永葆旺盛生命力和强大战斗力。思想建设是党建的重要内容，
                            中国共产党始终重视党的思想理论创新，着力从思想上建党、从理论上强党…
                                            <Text className='full'>全文</Text>
                        </View>
                        <View className='personal-item-content-imgs'>
                            <View className='at-row'>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                            </View>
                            <View className='at-row'>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                                <View className='at-col at-col-4'>
                                    <Image
                                        src=''
                                        mode='aspectFit'
                                        onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                        className='content-img'
                                    />
                                </View>
                            </View>
                        </View>

                        <View className='personal-item-content-option at-row'>
                            <View className='at-col at-col-4'>
                                点赞
                                            </View>
                            <View className='at-col at-col-4'>
                                转发
                                            </View>
                            <View className='at-col at-col-4' onClick={this.handleCommentTextrea.bind(this)}>
                                评论
                                            </View>
                        </View>
                    </View>
                    <View className='personal-item-comment'>
                        <View className='comment-top'>张舞文，刘天义，杨昌蔚 等33人 觉得赞</View>
                        <View>
                            <Text className='comment-username'>段芳：</Text>语雀是一款优雅高效的在线文档编辑与协同工具， 让每个企业轻松拥有文档中心阿里巴巴集团内部使用多年，众多中小企业首选。</View>
                        <View>语雀是一款优雅高效的在线文档编辑与协同工具， 让每个企业轻松拥有文档中心阿里巴巴集团内部使用多年，众多中小企业首选。</View>
                        <View className="comment-bottom">
                            查看全部7条回复
                                        </View>
                    </View>
                </View>

                <View className='personal-item'>
                    <View className='personal-item-header at-row'>
                        <View className='at-col at-col-2'>
                            <Image
                                src=''
                                mode='aspectFit'
                                onError={e => {
                                    console.warn("imgError", e);
                                }}
                                className='headerimg'
                            />
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='username'>张明</View>
                            <View className='publictime'>2019-04-27 14:20</View>
                        </View>
                        <View className='at-col at-col-4 join-view'>
                            <Text className='join'>报名活动</Text>
                        </View>
                    </View>
                    <View className='personal-item-content'>
                        <View className="activity">
                            <Image
                                src=''
                                mode='aspectFit'
                                onError={e => {
                                    console.warn("imgError", e);
                                }}
                                className='activity-img'
                            />

                            <View className="activity-content">
                                <View className="activity-title">基层党建创新案例征集评选活动</View>
                                <View className="activity-title-sub at-row">
                                    <View className='at-col at-col-6'>
                                        2019年截至
                                                    </View>
                                    <View className='at-col at-col-6 text-right'>
                                        12345人已报名
                                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    this.state.isShowCommentTextarea
                    ?   <View className='comment-textarea'>
                            <View className='comment-textarea-shadow' onClick={this.handleCommentTextrea}></View>
                            <View className='comment-textarea-view'>
                                <AtTextarea
                                    count={false}
                                    height={160}
                                    value=''
                                    onChange={this.handleChange.bind(this)}
                                    maxLength={200}
                                    placeholder='你的问题是...'
                                />
                                <View className='at-row comment-textarea-bottom'>
                                    <View className='at-col at-col-6'>
                                        0 / 200
                                    </View>
                                    <View className='at-col at-col-6 comment-textarea-send'>
                                        <Text>发送</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    :   ''

                }
            </View >
        )
    }
}

export default Personal
