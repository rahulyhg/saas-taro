import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtTextarea } from 'taro-ui'
import { DetailProps, DetailState } from './index.interface'
import { connect } from '@tarojs/redux'
import './index.scss'
import Dimage from '../../../pages/common/dimage'
import { sliceStr, formatDate, globalData, debounce } from '../../../utils/common'
const apiBackImgPre = process.env.apiBackImgPre;

@connect(({ ecoDetail }) => ({
    ...ecoDetail,
}))

class Detail extends Component<DetailProps, DetailState> {
    config: Config = {
        navigationBarTitleText: '生态'
    }
    constructor(props: DetailProps) {
        super(props)
        this.state = {
            id: '',
            detail: {
                id: '',
                sysUserCover: '',
                sysUserName: '',
                createTime: '',
                content: '',
                picList: [],
                praiseList: [],
                commentDTOList: [],
                praiseCount: 0,
                commentCount: 0,
                isPraise: false,
            },
            curCommentContent: '',
            commentType: '',
            curBusinessId: '',
            isShowCommentTextarea: false,
            isShowFullContent: false
        }
    }

    componentWillMount() {
        this.setState({
            id: this.$router.params.id
        });
    }

    componentDidMount() {
        this.getDetail( this.state.id );
    }

    showFullContent () {
        this.setState({
            isShowFullContent: !this.state.isShowFullContent
        });
    }

    getDetail(id) {
        const { dispatch } = this.props;
        dispatch({
            type: `eco/getDetail`,
            payload: { id },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        detail: res.data
                    });
                }
            }
        });
    }

    handlePraise(businessId: string = '', handleType: string = '', e) {
        e.stopPropagation();// 阻止冒泡
        const { dispatch } = this.props;
        if( !businessId ) {
            return false;
        }
        const type = handleType == 'save' ? 'eco/savePraise' : 'eco/canclePraise';
        dispatch({
            type,
            payload: {
                businessId
            },
            callback: res => {
                if (res.code == 1) {
                    this.state.detail.isPraise = handleType == 'save';
                    if ( handleType == 'save' ) {
                        this.state.detail.praiseCount += 1;

                        // TODO 添加人员信息
                        // item.praiseList.unshift();
                    } else {
                        this.state.detail.praiseCount -= 1;

                        // TODO 除去人员信息
                        // item.praiseList = _lodash.without(item.praiseList, '');
                    }

                    this.setState({
                        detail: this.state.detail
                    });
                }
            }
        });
    }

    // 阻止冒泡
    handleBubble(e) {
        e.stopPropagation();
    }

    // 评论框展开、关闭
    handleShowComment(curBusinessId: string = '', commentType: string = '', e) {
        e && e.stopPropagation();// 阻止冒泡
        this.setState({
            isShowCommentTextarea: !this.state.isShowCommentTextarea,
            curBusinessId,
            commentType
        });
    };

    // 评论框输入监控
    handleCommentTextareaChange(e) {
        let curCommentContent = e.detail.value.trim();

        if ( curCommentContent.length > 200 ) {
            Taro.showToast({
                title: '对不起，你的评论过长',
                icon: 'error',
                duration: 2000
            });
            return false;
        }

        // Todo 敏感词校验

        this.setState({
            curCommentContent
        });
    }

    // 新增评论
    handleComment = debounce(() => {
        const { dispatch } = this.props;
        if ( this.state.commentType ) {
            dispatch({
                type: `eco/${this.state.commentType}`,
                payload: {
                    businessId: this.state.curBusinessId,
                    replyId: this.state.curBusinessId,
                    replyCommentId: this.state.curBusinessId,
                    replyMsg: this.state.curCommentContent
                },
                callback: res => {
                    if (res.code == 1) {
                        console.log(res);
                        Taro.showToast({
                            title: '评论成功',
                            icon: 'success',
                            duration: 2000
                        });

                        // 添加评论内容
                        this.state.detail.commentDTOList.unshift( res.data );
                    }

                    this.handleShowComment('', '', null);
                }
            });
        }
        
    }, 300);

    // 转发
    onShareAppMessage(res) {
        const { dispatch } = this.props;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            const { detail } = this.state;

            dispatch({
                type: 'eco/forward',
                payload: {
                    id: detail.id
                },
                callback: res => {
                    if (res.code == 1) {
                        console.log("分享成功");
                    }
                }
            });
            
            return {
                title: sliceStr(detail.content, 50),
                path: '/page/user?id=123',
                imageUrl: ( detail.picList && detail.picList.length > 0 ) ? detail.picList[0] : ''
            }
        }
        
        return {
            title: 'AI党建',
            path: process.env.apiHost + '/#/login?appId=',
            imageUrl: 'https://t1.71dj.org/config/logo/logo.jpg'
        }
    }

    render() {
        const { detail } = this.state;

        return (
            <View className='detail'>
                <View className='detail-header'>
                    <View className='at-row'>
                        <View className='at-col at-col-2'>
                            <Dimage
                                src={ apiBackImgPre + detail.sysUserCover }
                                mode='aspectFit'
                                type='avatar'
                                styleValue='width: 80rpx;height: 80rpx;border-radius: 50%;'
                            />
                        </View>
                        <View className='at-col at-col-10'>
                            <View className='username'>{ detail.sysUserName }</View>
                            <View className='publictime'>{ formatDate( detail.createTime, globalData.commonDateFormatStr) }</View>
                        </View>
                    </View>
                </View>
                <View className='detail-content'>
                    {
                        detail.content && detail.content.length > 50 && this.state.isShowFullContent
                        ?   <View className='detail-content-text'>
                                detail.content
                                <Text className='full' onClick={this.showFullContent}>收起</Text>
                            </View>
                        :   <View className='detail-content-text'>
                                { sliceStr(detail.content, 50) }
                                { 
                                    detail.content && detail.content.length > 50 && 
                                    <Text className='full' onClick={this.showFullContent}>全文</Text>
                                }
                            </View>
                    }
                    
                    {
                        detail.picList ?
                            <View className={ detail.picList.length == 1 ? 'detail-content-imgs-for1' :
                                ( detail.picList.length == 4 ? 'detail-content-imgs-for4' : 'detail-content-imgs')}>

                                {
                                    detail.picList.map((img) => {
                                        return (
                                            <View className={ detail.picList.length == 1 ? 'detail-content-imgs-for1-item' :
                                                ( detail.picList.length == 4 ? 'detail-content-imgs-for4-item'
                                                    : 'detail-content-imgs-item')}>
                                                <Dimage
                                                    src={ apiBackImgPre + img }
                                                    mode='aspectFit'
                                                    type='0'
                                                    styleValue={ detail.picList.length == 1 ? 'width: 60%;'
                                                        : 'width: 100%;height: 220rpx;padding: 6rpx;'}
                                                />
                                            </View>
                                        )
                                    })
                                }

                            </View>
                            : ''
                    }
                </View>

                {
                    detail.praiseList.length > 0 &&
                    <View className='detail-like'>
                        <View className='detail-like-content'>
                            { detail.praiseList.map(name => { return name }) }
                            { detail.praiseCount > 3 ? `等${detail.praiseCount}人` : '' } 觉得赞
                        </View>
                    </View>
                }
                

                <View className='detail-comment'>
                    <View className='detail-comment-title'>用户评论</View>

                    {
                        detail.commentDTOList.map( item => {
                            return (
                                <View className='detail-comment-item'>
                                    <View className='detail-comment-item-head'>
                                        <Dimage
                                            src={ apiBackImgPre + item.commentUserAvatar }
                                            mode='aspectFit'
                                            type='avatar'
                                            styleValue='width: 60rpx;height: 60rpx;border-radius: 50%;'
                                        />
                                    </View>
                                    <View className='detail-comment-item-body'>
                                        <View className='detail-comment-username'>{ item.commentUserName }</View>
                                        <View className='detail-comment-content'>
                                            { item.replyMsg }
                                        </View>
                                        <View className='detail-comment-time'>{ formatDate( item.createTime, globalData.commonDateFormatStr) }</View>
                                    
                                        {
                                            item.sonList.map(son => {
                                                return (
                                                    <View className='detail-comment-sublist'>
                                                        <View className='detail-comment-subitem'>
                                                            <Text className='text-orange'>{ item.commentUserName }</Text>
                                                            <Text className='detail-comment-reply-text'>回复</Text>
                                                            <Text className='text-orange'>{ item.sysUserName }：</Text>
                                                            { son.replyMsg }
                                                        </View>
                                                    </View>
                                                );
                                            })
                                            
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                    
                </View>

                <View className='detail-content-option at-row'>
                    <View className='at-col at-col-4' onClick={ this.handlePraise.bind(this, detail.id, detail.isPraise ? '' : 'save') }>
                        <AtIcon prefixClass='icon icon-zan' value='chevron-right' size='14' color={ detail.isPraise ? '#FF574F' : '#ccc' } />
                        <Text className={detail.isPraise ? 'option-text active' : 'option-text'}>{ detail.praiseCount > 0 ? detail.praiseCount : '点赞'}</Text>
                    </View>
                    <View className='at-col at-col-4 porel' onClick={ this.handleBubble.bind(this) } >
                        <View>
                            <AtIcon prefixClass='icon icon-zhuanfa' value='chevron-right' size='14' color='#ccc'></AtIcon>
                            <Text className='option-text'>转发</Text>
                        </View>
                        <Button className="shareBtn" openType='share' data-id={ detail.id }/>
                    </View>
                    <View className='at-col at-col-4' onClick={ this.handleShowComment.bind(this, detail.id, 'addComment') }>
                        <AtIcon prefixClass='icon icon-pinglun' value='chevron-right' size='14' color='#ccc'></AtIcon>
                        <Text className='option-text'>{ detail.commentCount > 0 ? detail.commentCount : '评论'}</Text>
                    </View>
                </View>

                {
                    this.state.isShowCommentTextarea
                        ? <View className='comment-textarea'>
                            <View className='comment-textarea-shadow' onClick={this.handleShowComment.bind(this, '')}></View>
                            <View className='comment-textarea-view'>
                                <AtTextarea
                                    count={false}
                                    height={160}
                                    value=''
                                    onChange={this.handleCommentTextareaChange.bind(this)}
                                    maxLength={200}
                                    placeholder='你的问题是...'
                                />
                                <View className='at-row comment-textarea-bottom'>
                                    <View className='at-col at-col-6'>
                                        { this.state.curCommentContent.length } / 200
                                    </View>
                                    <View className='at-col at-col-6 comment-textarea-send'>
                                        <Text onClick={ this.handleComment.bind(this) }>发送</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : ''

                }
            </View>
        )
    }
}

export default Detail
