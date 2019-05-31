
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Navigator, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import _lodash from 'underscore';
import { IndexProps, IndexState } from './index.interface'

import { AtTabs, AtTabsPane, AtTextarea, AtIcon } from 'taro-ui'
import './index.scss'
import Dimage from '../../common/dimage'
import Loading from '../../common/loading'
import Nodata from '../../common/nodata'
import { sliceStr, debounce, formatDate, globalData } from '../../../utils/common'
const apiBackImgPre = process.env.apiBackImgPre;
const remoteImgPreUrl = process.env.remoteImgPreUrl;

@connect(({ eco,surveyJoin }) => ({
    ...eco,
    ...surveyJoin
}))

class Index extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: '生态'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            list: [],
            tabCurrent: 0,
            pageCurrent: 1,
            pageSize: 10,
            isShowCommentTextarea: false,
            isShowPublic: false,
            finished: false,
            loading: false,
            curBusinessId: '',
            curCommentContent: '',
            commentType: ''
        }
    }

    componentDidMount() {
        this.handleEcoTabClick(this.state.tabCurrent);
    }

    toPublic(type: number, e) {
        e.stopPropagation();
        let url = '';
        switch (type) {
            case 0:
                url = '/subPackageEco/pages/public/index';
                break;
            case 1:
                url = '/subPackageEco/pages/activity/create/index';
                break;
            case 2:
                url = '/subPackageEco/pages/public/index';
                break;
            case 3:
                url = '/subPackageEco/pages/survey/create/index';
                break;
            case 4:
                url = '/subPackageEco/pages/answer/create/index';
                break;
            default:
                break;

        }
        this.setState({
            isShowPublic: false
        }, () => {
            Taro.navigateTo({
                url: url
            })
        })

    }

    handlePublic() {
        this.setState({
            isShowPublic: !this.state.isShowPublic
        });
    }

    handleEcoTabClick(val: number) {
        this.setState({
            tabCurrent: val
        });
        switch (val) {
            case 0:
                this.getList(true, 'getPageList');
                break;
            case 1:
                this.getList(true, 'getActionPageList');
                break;
            case 2:
                this.getList(true, 'getMyPageList');
                break;
        }

    }

    getList(reset: boolean = false, type: string = 'getPageList') {
        if (reset) {
            this.setState({
                list: [],
                pageCurrent: 0
            });
        }
        this.setState({
            loading: true
        });
        const { dispatch } = this.props;
        dispatch({
            type: `eco/${type}`,
            payload: {
                current: this.state.pageCurrent,
                pageSize: this.state.pageSize,
            },
            callback: res => {
                let { code, data, msg } = res;
                if (code == 1) {
                    this.setState({
                        list: this.state.list.concat(data),
                        pageCurrent: this.state.pageCurrent + 1
                    });
                } else {
                    console.log("TCL: Index -> getPageList -> msg", msg)
                }

                this.setState({
                    loading: false
                });
            }
        });
    }

    handlePraise(businessId: string = '', handleType: string = '', e) {
        e.stopPropagation();// 阻止冒泡
        const { dispatch } = this.props;
        if (!businessId) {
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
                    this.state.list.forEach(item => {
                        if (item.id == businessId) {
                            item.isPraise = handleType == 'save';
                            if (handleType == 'save') {
                                item.praiseCount += 1;

                                // TODO 添加人员信息
                                // item.praiseList.unshift();
                            } else {
                                item.praiseCount -= 1;

                                // TODO 除去人员信息
                                // item.praiseList = _lodash.without(item.praiseList, '');
                            }
                        }
                    });

                    this.setState({
                        list: this.state.list
                    });
                }
            }
        });
    }

    // 转发
    onShareAppMessage(res) {
        const { dispatch } = this.props;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            const shareObj = this.state.list.find(item => {
                if (item.id == res.target.dataset.id) {
                    return item;
                }
            });

            dispatch({
                type: 'eco/forward',
                payload: {
                    id: shareObj.id
                },
                callback: res => {
                    if (res.code == 1) {
                        console.log("分享成功");
                    }
                }
            });

            return {
                title: sliceStr(shareObj.content, 50),
                path: '/page/user?id=123',
                imageUrl: (shareObj.picList && shareObj.picList.length > 0) ? shareObj.picList[0] : ''
            }
        }

        return {
            title: 'AI党建',
            path: process.env.apiHost + '/#/login?appId=',
            imageUrl: 'https://t1.71dj.org/config/logo/logo.jpg'
        }
    }

    loadMoreEvt() {
        this.getList();
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

        if (curCommentContent.length > 200) {
            Taro.showToast({
                title: '对不起，你的评论过长',
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
        if (this.state.commentType) {
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

                        // list添加评论内容
                        this.state.list.forEach(item => {
                            if (item.id == res.data.businessId) {
                                item.commentDTOList.unshift(res.data);
                            }
                        });
                    }

                    this.handleShowComment('', '', null);
                }
            });
        }

    }, 300);

    async toActivity(id: string, type: number) {
        console.log(id, type);
        // 1 报名 2 投票 3调查 4答题
        let url = '';
        switch (type) {
            case 1:
                url = this.state.tabCurrent==2 ? `/subPackageEco/pages/activity/edit/index?id=${id}` : `/subPackageEco/pages/activity/detail/index?id=${id}`;
                break;
            case 2:
                url =  this.state.tabCurrent==2 ? `/subPackageEco/pages/vote/edit/index?id=${id}` : `/subPackageEco/pages/vote/detail/index?id=${id}`;
                break;
            case 3:
                // 判断是否参加过调查
                const { dispatch } = this.props;
                await dispatch({
                    type: 'surveyJoin/isPartake',
                    payload: { id: id }
                })
                url = this.state.tabCurrent==2 ? `/subPackageEco/pages/survey/edit/index?id=${id}` : (this.props.isPartake ? `/subPackageEco/pages/survey/userdetail/index?id=${id}` : `/subPackageEco/pages/survey/detail/index?id=${id}`);
                break;
            case 4:
                url = this.state.tabCurrent==2 ? `/subPackageEco/pages/answer/edit/index?id=${id}` : `/subPackageEco/pages/answer/detail/index?id=${id}`;
                break;
            default:
                break;
        }
        Taro.navigateTo({ url });
    }

    render() {
        const tabContentForEco = this.state.list.map((item, index) => {
            return item.type == 0 ?
                <Navigator url={`/subPackageEco/pages/detail/index?id=${item.id}`}>
                    <View className='eco-tab-item' key={item.id}>
                        <View className='eco-tab-item-header at-row'>
                            <View className='at-col at-col-2'>
                                <Dimage mode='aspectFit' src={item.sysUserCover} type='avatar'
                                    styleValue='height: 80rpx;width: 80rpx;border-radius: 50%;' />
                            </View>
                            <View className='at-col at-col-10'>
                                <View className='username'>{item.sysUserName}</View>
                                <View className='publictime'>{item.createTime}</View>
                            </View>
                        </View>
                        <View className='eco-tab-item-content'>
                            <View className='eco-tab-item-content-text'>
                                {sliceStr(item.content, 50)}
                                {
                                    item.content && item.content.length > 50 && <Text className='full'>全文</Text>
                                }
                            </View>
                            {
                                item.picList ?
                                    <View className={item.picList.length == 1 ? 'eco-tab-item-content-imgs-for1' :
                                        (item.picList.length == 4 ? 'eco-tab-item-content-imgs-for4' : 'eco-tab-item-content-imgs')}>

                                        {
                                            item.picList.map((img) => {
                                                return (
                                                    <View className={item.picList.length == 1 ? 'eco-tab-item-content-imgs-for1-item' :
                                                        (item.picList.length == 4 ? 'eco-tab-item-content-imgs-for4-item'
                                                            : 'eco-tab-item-content-imgs-item')}>
                                                        <Dimage
                                                            src={apiBackImgPre + img}
                                                            mode='aspectFit'
                                                            type='0'
                                                            styleValue={item.picList.length == 1 ? 'width: 60%;'
                                                                : 'width: 100%;height: 220rpx;padding: 6rpx;'}
                                                        />
                                                    </View>
                                                )
                                            })
                                        }

                                    </View>
                                    : ''
                            }

                            <View className='eco-tab-item-content-option at-row'>
                                <View className='at-col at-col-4' onClick={this.handlePraise.bind(this, item.id, item.isPraise ? '' : 'save')}>
                                    <AtIcon prefixClass='icon icon-zan' value='chevron-right' size='14' color={item.isPraise ? '#FF574F' : '#ccc'} />
                                    <Text className={item.isPraise ? 'option-text active' : 'option-text'}>{item.praiseCount > 0 ? item.praiseCount : '点赞'}</Text>
                                </View>
                                <View className='at-col at-col-4 porel' onClick={this.handleBubble.bind(this)} >
                                    <View>
                                        <AtIcon prefixClass='icon icon-zhuanfa' value='chevron-right' size='14' color='#ccc'></AtIcon>
                                        <Text className='option-text'>转发</Text>
                                    </View>
                                    <Button className="shareBtn" openType='share' data-id={item.id} />
                                </View>
                                <View className='at-col at-col-4' onClick={this.handleShowComment.bind(this, item.id, 'addComment')}>
                                    <AtIcon prefixClass='icon icon-pinglun' value='chevron-right' size='14' color='#ccc'></AtIcon>
                                    <Text className='option-text'>{item.commentCount > 0 ? item.commentCount : '评论'}</Text>
                                </View>
                            </View>
                        </View>
                        {
                            item.commentCount > 0 ?
                                <View className='eco-tab-item-comment'>
                                    {
                                        item.praiseCount > 0 &&
                                        <View className='comment-top'>
                                            {item.praiseList && item.praiseList.map(name => { return name })}
                                            {item.praiseCount > 3 ? `等${item.praiseCount}人` : ''} 觉得赞
                                        </View>
                                    }

                                    {
                                        item.commentDTOList.map((comment) => {
                                            return (
                                                comment.replyId ?
                                                    <View key={comment.id} onClick={this.handleShowComment.bind(this, comment.id, 'replyComment')}>
                                                        <Text className='comment-username'>{comment.commentUserName}</Text>
                                                        <Text className='comment-reply-text'>回复</Text>
                                                        <Text className='comment-username'>{comment.sysUserName}：</Text>
                                                        {comment.replyMsg}
                                                    </View>
                                                    :
                                                    <View key={comment.id} onClick={this.handleShowComment.bind(this, comment.id, 'addReply')}>
                                                        <Text className='comment-username'>{comment.commentUserName}：</Text>
                                                        {comment.replyMsg}
                                                    </View>
                                            );
                                        })
                                    }

                                    {
                                        item.commentCount > 3 && !item.showAllComment ?
                                            <View className="comment-bottom">
                                                查看全部{item.commentCount}条回复
                                            </View>
                                            : ''
                                    }

                                </View>
                                : ''
                        }

                    </View>
                </Navigator>
                :
                <View className='eco-tab-item active'>
                    <View className='eco-tab-item-header at-row'>
                        <View className='at-col at-col-2'>
                            <Dimage mode='aspectFit' src={item.sysUserCover} type='avatar' styleValue='height: 80rpx;width: 80rpx;border-radius: 50%;' />
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='username'>{item.sysUserName}</View>
                            <View className='publictime'>{item.createTime}</View>
                        </View>
                        <View className='at-col at-col-4 join-view'>

                            <Text className='join' onClick={this.toActivity.bind(this, item.activityCode, item.type)}>{item.type == '1' ? '报名活动' : (item.type == '2' ? '投票活动' : (item.type == '3' ? '调查活动' : '答题活动'))}</Text>
                        </View>
                    </View>
                    <View onClick={this.toActivity.bind(this, item.activityCode, item.type)}>
                        <View className='eco-tab-item-content'>
                            <View className="activity">
                                <Dimage
                                    src={apiBackImgPre + item.activityPic}
                                    mode='widthFix'
                                    type={item.type + ''}
                                    styleValue='width: 100%;height: 360rpx;'
                                />

                                <View className="activity-content">
                                    <View className="activity-title">{item.activityTitle}</View>
                                    <View className="activity-title-sub at-row">
                                        <View className='at-col at-col-6'>
                                            {formatDate(item.endTime, globalData.customDateFormatStr)} 截止
                                        </View>
                                        <View className='at-col at-col-6 text-right'>
                                            {item.enterNum > 0 ? `${item.enterNum}人已报名` : ''}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
        });

        const tabContentForAction = this.state.list.map((item, index) => {
            return (
                <View className='update-item'>
                    <View className='update-head at-row'>
                        <View className='at-col at-col-2'>
                            <Dimage
                                src={apiBackImgPre + item.attendUserAvatar}
                                mode='aspectFit'
                                type='avatar'
                                styleValue='width: 80rpx;height: 80rpx;border-radius: 50%;'
                            />
                        </View>
                        <View className='at-col at-col-6'>
                            <View className='username'>
                                <Text className='text-padding-right text-padding-right'>{item.attendUserName}</Text>

                                {item.action == 0 && <Text className='text-padding-right text-orange'>点赞了</Text>}
                                {item.action == 1 && <Text className='text-padding-right text-orange'>评论了</Text>}
                                {item.action == 2 && <Text className='text-padding-right text-orange'>回复了</Text>}
                                {item.action == 3 && <Text className='text-padding-right text-orange'>转发了</Text>}
                                {item.action == 4 && <Text className='text-padding-right text-orange'>报名了</Text>}
                                {item.action == 5 && <Text className='text-padding-right text-orange'>投票了</Text>}
                                {item.action == 6 && <Text className='text-padding-right text-orange'>调查了</Text>}
                                {item.action == 7 && <Text className='text-padding-right text-orange'>答题了</Text>}

                                <Text className='text-padding-right'>我</Text>
                            </View>
                            <View className='publictime'>{formatDate(item.createTime, globalData.commonDateFormatStr)}</View>
                        </View>
                        <View className='at-col at-col-4'>
                            <Image
                                src=''
                                mode='aspectFit'
                                onError={e => {
                                    console.warn("imgError", e);
                                }}
                                className='updateimg'
                            />
                        </View>
                    </View>
                    {
                        item.attendContent &&
                        <View className='update-content'>
                            {item.attendContent}
                        </View>
                    }

                </View>
            )
        })

        return (
            <View className='eco-wrap'>
                <View>
                    <AtTabs
                        current={this.state.tabCurrent}
                        tabList={[
                            { title: '生态' },
                            { title: '动态' },
                            { title: '我的发布' }
                        ]}
                        onClick={this.handleEcoTabClick.bind(this)}>
                        <AtTabsPane current={this.state.tabCurrent} index={0}>
                            {
                                this.state.list.length > 0 &&
                                <ScrollView className='eco-tab' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                    {tabContentForEco}
                                </ScrollView>
                            }
                        </AtTabsPane>
                        <AtTabsPane current={this.state.tabCurrent} index={1}>
                            {
                                this.state.list.length > 0 &&
                                <ScrollView className='eco-tab' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                    {tabContentForAction}
                                </ScrollView>
                            }
                        </AtTabsPane>
                        <AtTabsPane current={this.state.tabCurrent} index={2}>
                            {
                                this.state.list.length > 0 &&
                                <ScrollView className='eco-tab' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                    {tabContentForEco}
                                </ScrollView>
                            }
                        </AtTabsPane>
                    </AtTabs>

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
                                        {this.state.curCommentContent.length} / 200
                                    </View>
                                    <View className='at-col at-col-6 comment-textarea-send'>
                                        <Text onClick={this.handleComment.bind(this)}>发送</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : ''

                }

                <View className="eco-public-btn" onClick={this.handlePublic}>
                    <View className='eco-public-btn-text'>
                        <AtIcon prefixClass='icon icon-xinzeng' value='chevron-right' size='18' color='#FFF'/>
                        <View>发布</View>
                    </View> 
                </View>

                {
                    this.state.isShowPublic
                        ? <View className="eco-public" onClick={this.handlePublic}>
                            <View className="eco-public-list">
                                <View className='eco-public-title'>你可以发布</View>

                                <View className='eco-public-item at-row' onClick={this.toPublic.bind(this, 0)}>
                                    <View className='at-col at-col-3'>
                                        <View className="eco-public-item-icon">
                                            <Image
                                                src={remoteImgPreUrl + 'images/eco/icon-eco.png'}
                                                mode='aspectFit'
                                                className='eco-public-item-icon-img'
                                            />
                                        </View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='eco-public-item-title'>生态</View>
                                        <View className='eco-public-item-title-sub'>记录你的点滴动态</View>
                                    </View>
                                    <View className='at-col at-col-2 eco-public-item-arrow'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='18' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='eco-public-item at-row' onClick={this.toPublic.bind(this, 1)}>
                                    <View className='at-col at-col-3'>
                                        <View className="eco-public-item-icon">
                                            <Image
                                                src={remoteImgPreUrl + 'images/eco/icon-activity.png'}
                                                mode='aspectFit'
                                                className='eco-public-item-icon-img'
                                            />
                                        </View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='eco-public-item-title'>报名活动</View>
                                        <View className='eco-public-item-title-sub'>记录你的点滴动态</View>
                                    </View>
                                    <View className='at-col at-col-2 eco-public-item-arrow'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='18' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='eco-public-item at-row' onClick={this.toPublic.bind(this, 2)}>
                                    <View className='at-col at-col-3'>
                                        <View className="eco-public-item-icon">
                                            <Image
                                                src={remoteImgPreUrl + 'images/eco/icon-vote.png'}
                                                mode='aspectFit'
                                                className='eco-public-item-icon-img'
                                            />
                                        </View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='eco-public-item-title'>投票活动</View>
                                        <View className='eco-public-item-title-sub'>记录你的点滴动态</View>
                                    </View>
                                    <View className='at-col at-col-2 eco-public-item-arrow'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='18' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='eco-public-item at-row' onClick={this.toPublic.bind(this, 3)}>
                                    <View className='at-col at-col-3'>
                                        <View className="eco-public-item-icon">
                                            <Image
                                                src={remoteImgPreUrl + 'images/eco/icon-survey.png'}
                                                mode='aspectFit'
                                                className='eco-public-item-icon-img'
                                            />
                                        </View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='eco-public-item-title'>调查活动</View>
                                        <View className='eco-public-item-title-sub'>记录你的点滴动态</View>
                                    </View>
                                    <View className='at-col at-col-2 eco-public-item-arrow'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='18' color='#ccc'></AtIcon>
                                    </View>
                                </View>

                                <View className='eco-public-item at-row' onClick={this.toPublic.bind(this, 4)}>
                                    <View className='at-col at-col-3'>
                                        <View className="eco-public-item-icon">
                                            <Image
                                                src={remoteImgPreUrl + 'images/eco/icon-answer.png'}
                                                mode='aspectFit'
                                                className='eco-public-item-icon-img'
                                            />
                                        </View>
                                    </View>
                                    <View className='at-col at-col-7'>
                                        <View className='eco-public-item-title'>答题活动</View>
                                        <View className='eco-public-item-title-sub'>记录你的点滴动态</View>
                                    </View>
                                    <View className='at-col at-col-2 eco-public-item-arrow'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='18' color='#ccc'></AtIcon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : ''
                }

                <Loading finished={this.state.finished} loading={this.state.loading} />

                <Nodata show={this.state.list.length <= 0 && !this.state.loading} notice='暂无数据' stylevalue='margin-top: 48rpx;' />
            </View>
        )
    }
}

export default Index
