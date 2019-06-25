import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Picker, Block, Text } from "@tarojs/components";
import { AtTextarea, AtButton, AtIcon, AtTabs, AtTabsPane, AtDivider, AtInput } from "taro-ui";
import { connect } from "@tarojs/redux";
import { IeditProps, IeditState } from "./index.interface";
import Dimage from '../../../../pages/common/dimage'
const remoteImgPreUrl = process.env.remoteImgPreUrl;
import "./index.scss";
import Nodata from '../../../../pages/common/nodata'
import { dateFormat } from '@/src/utils/common'
import common from "@/src/models/common";
import DjLoading from "@/src/pages/common/djLoading";

@connect(({ actEditAndResult, activityOrg, activityUser, orgSinglePopView, loading }) => ({
    ...actEditAndResult,
    oldCheckedOrgList: activityOrg.oldCheckedOrgList,
    oldCheckedUserList: activityUser.oldCheckedUserList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg,
    loading: loading.effects['actEditAndResult/activityResult'],

}))
class Edit extends Component<IeditProps, IeditState> {
    config: Config = {
        navigationBarTitleText: "报名详情"
    };
    constructor(props: IeditProps) {
        super(props);
        this.state = {
            noDataImg: remoteImgPreUrl + "images/empty.png",
            tabList: [{ title: "报名结果" }, { title: "编辑" }],
            currentTab: 1,
            lists: [{ imgs: [{}] }, { imgs: [{}, {}] }, { imgs: [{}, {}, {}] }],
            pageNum: 1,
            pageSize: 10,
            nodata: null,
            loadmore: "",
            isBegin: false,
            isEnd: false
        };
    }

    componentDidMount() {
        // 页面初始化 调报名接口 地址
        this.activityResult(this.$router.params.id, this.state.pageNum);
        const id = this.$router.params.id;
        this.activityDetail({ id: this.$router.params.id });
    }
    componentDidShow() {
        console.log(this.props.checkedOrgList)
        console.log(this.props.checkedUserList)
        this.setState({

            checkedOrgList: this.props.checkedOrgList,
            checkedUserList: this.props.checkedUserList
        })
    }

    componentWillUnmount() {
        console.log('卸载的时候:清除组织和人员选择');
        const { dispatch } = this.props;
        dispatch({
            type: 'popView/clear'
        });
    }

    handleTabClick(val) {
        console.log(val);
        this.setState({
            currentTab: val
        });
    }

    // 标题
    handleTitleChange = e => {
        this.setState({

            activityFormData: {
                ...this.state.activityFormData,
                //title: e.detail.value
                title: e
            }
        })
    }

    // 内容
    handleContentChange = e => {
        this.setState({
            activityFormData: {
                ...this.state.activityFormData,
                //content: e.detail.value
                content: e
            }
        })
    }


    // 日期选择
    onDateChange = (type, e) => {
        if (type === 'start') {

            this.setState({
                activityFormData: {
                    ...this.state.activityFormData,
                    startTime: e.detail.value
                }
            })
        } else {

            this.setState({
                activityFormData: {
                    ...this.state.activityFormData,
                    endTime: e.detail.value
                }
            })
        }
        console.log(type, e)
    }

    // 组织选择
    handleChooseOrg = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }

        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                title: '请先选择发起组织',
                duration: 2000,
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            //url: '/pages/common/orgPopView/orgPopView'
            url: '/subPackageEco/pages/org/index?orgId=' + this.props.checkedOrg.id
        })
    }

    // 人员选择
    handleChooseUser = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }

        if (!this.props.checkedOrg.id) {
            Taro.showToast({
                title: '请先选择发起组织',
                duration: 2000,
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            //url: '/pages/common/userPopView/userPopView'
            url: '/subPackageEco/pages/user/index?disabled=0&orgId=' + this.props.checkedOrg.id
        })
    }

    // 设置封面
    chooseCover = e => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {
                let filepath = res && res.tempFilePaths[0];
                _this.uploadFile(filepath);
            }
        })
    }
    uploadFile = filepath => {
        let _this = this;
        /*
        Taro.uploadFile({
            url: process.env.apiHost + '/api/common/imageUpload',
            filePath: filepath,
            name: 'file',
            formData: { businessName: 'activity' }
        }).then(res => {
            console.log(res);
            //const { path } = res.data;
            this.setState({

                activityFormData: {
                    ..._this.state.activityFormData,
                    cover: JSON.parse(res.data).path
                }
            })
        })*/

        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadSingleFile',
            payload: {
                filePath: filepath,
                businessName: 'activity'
            },
            callback: res => {
                if (res.code == 1) {
                    this.setState({
                        activityFormData: {
                            ..._this.state.activityFormData,
                            cover: res.data.path,
                            coverId: res.data.id
                        }
                    });
                }
            }
        });
    }

    // 请求详情接口
    activityResult(activityId, _pageNum) {
        const { dispatch } = this.props;
        const _objdata = {
            activityId: activityId, //  活动id string
            current: _pageNum, //  跳转到的页数 integer
            pageSize: this.state.pageSize // 每页展示的记录数 integer
        };
        dispatch({
            type: "actEditAndResult/activityResult",
            payload: _objdata,
            callback: res => {
                if (res.code == "1") {
                    const _lists = res.data || [];
                    // let lists = this.state.lists
                    let pageNum = _objdata.current;
                    let nodata = false;
                    let loadmore = "";

                    if (_pageNum == 1 && _lists.length == 0) {
                        // 暂无通知数据
                        nodata = true;
                        loadmore = "";
                    } else if (_lists.length < _objdata.pageSize) {
                        // 到底啦
                        nodata = false;
                        loadmore = "到底啦";
                    } else {
                        nodata = false;
                        loadmore = "加载中";
                        pageNum += 1;
                    }
                    this.setState({
                        pageNum,
                        loadmore,
                        lists: _lists,
                        nodata
                    });
                } else {
                    Taro.showModal({
                        title: "提示",
                        content: res.msg || "服务器开小差啦",
                        showCancel: false
                    });
                }
            }
        });
    }
    // 列表 加载更多 点击事件
    loadmore() {
        const id = this.$router.params.id;
        this.activityResult(id, this.state.pageNum)
    }

    // 发起组织
    handleChooseStartOrg = e => {
        const { isEnd } = this.state;
        if (isEnd) {
            Taro.showToast({
                title: '活动已结束，无法修改',
                icon: 'none'
            })
            return false
        }
        Taro.navigateTo({
            url: '/pages/common/orgSinglePopView/orgSinglePopView'
        })
    }

    // 请求活动详情接口
    activityDetail = async (params) => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'actEditAndResult/activityDetail',
            payload: { ...params }
        })

        dispatch({
            type: 'activityOrg/updateState',
            payload: {
                oldCheckedOrgList: this.props.activityFormData.joinOrg,
                checkedOrgList: this.props.activityFormData.joinOrg
            }
        })

        dispatch({
            type: 'activityUser/updateState',
            payload: {
                oldCheckedUserList: this.props.activityFormData.joinUser,
                checkedUserList: this.props.activityFormData.joinUser
            }
        })

        dispatch({
            type: 'orgSinglePopView/updateState',
            payload: {
                checkedOrg: this.props.activityFormData.launchOrg
            }
        })

        const startTime = dateFormat(this.props.activityFormData.startTime, 'yyyy-MM-dd');
        const endTime = dateFormat(this.props.activityFormData.endTime, 'yyyy-MM-dd');
        const nowTime = dateFormat(new Date(), 'yyyy-MM-dd');



        this.setState({
            activityFormData: this.props.activityFormData,
            checkedOrgList: this.props.checkedOrgList,
            checkedUserList: this.props.checkedUserList,
            isBegin: nowTime >= startTime,
            isEnd: nowTime > endTime
        })

    }

    // 编辑活动保存
    saveActivity = () => {
        const { dispatch } = this.props;

        let orgs: any = [];
        let users: any = [];
        this.state.checkedOrgList.forEach(element => {
            let findIndex = -1;
            this.props.oldCheckedOrgList.forEach((item, index) => {
                if (item.orgId == element.orgId) {
                    findIndex = index;
                }
            })
            if (findIndex <= -1) {
                orgs.push({
                    orgId: element.orgId,
                    orgName: element.orgName
                })
            }

        });
        this.state.checkedUserList.forEach(element => {
            let findIndex = -1;
            this.props.oldCheckedUserList.forEach((item, index) => {
                if (item.userId == element.userId) {
                    findIndex = index;
                }
            })
            if (findIndex <= -1) {
                users.push({
                    userId: element.userId,
                    avatar: element.avatar,
                    userName: element.userName
                })
            }
        });

        const launchOrg = {
            id: this.props.checkedOrg.id,
            name: this.props.checkedOrg.name,
            code: this.props.checkedOrg.code,
        };
        const {
            id,
            title,
            content,
            startTime,
            endTime,
            cover
        } = this.state.activityFormData;
        dispatch({
            type: 'actEditAndResult/activityEdit',
            payload: {
                id,
                title,
                content,
                startTime,
                endTime,
                joinOrg: orgs,
                joinUser: users,
                cover,
                launchOrg
            }
        })
    }

    // 删除活动 
    deleteActivityById = e => {
        const { dispatch } = this.props;
        const _this = this;
        dispatch({
            type: 'activityDetail/deleteActivityById',
            payload: { id: _this.$router.params.id }
        })
    }

    // 报名详情
    goDetail = (detailId, e) => {
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/signUpDetail/index?activityId=' + this.$router.params.id + "&detailId=" + detailId
        })
    }


    render() {

        const { activityFormData, tabList, lists, loadmore, noDataImg, checkedOrgList, checkedUserList, isBegin, isEnd } = this.state;

        const { checkedOrg, loading } = this.props;
        console.error(loading, lists)
        const startTimeFormat = dateFormat(this.state.activityFormData.startTime, 'yyyy年MM月dd日');
        const endTimeFormat = dateFormat(this.state.activityFormData.endTime, 'yyyy年MM月dd日');

        return (
            <View className="activity-edit">
                <AtTabs
                    current={this.state.currentTab}
                    swipeable={true}
                    tabList={tabList}
                    onClick={this.handleTabClick.bind(this)}
                >
                    <AtTabsPane current={this.state.currentTab} index={0}>
                        <View className="activity-result">
                            <Nodata show={lists.length <= 0 && !loading} notice='暂无数据' stylevalue='margin-top: 48rpx;' />
                            {lists && (
                                lists.map((item, index) => {
                                    return (
                                        <View key={`list${index}`}>
                                            <View className="activity-result-item van-hairline--bottom">
                                                <View className="activity-result-item-head at-row" onClick={this.goDetail.bind(this, item.detailId)}>

                                                    <Dimage src={item.avatar} type='avatar' />

                                                    <View className='at-col'>
                                                        <View className="activity-result-item-head-info">
                                                            <View className='at-row'>
                                                                <View className="activity-result-item-head-info-username at-col">
                                                                    {
                                                                        item.personName
                                                                    }
                                                                </View>
                                                                <View className="activity-result-item-head-info-time-right  at-col">
                                                                    {
                                                                        item.createTime
                                                                    }
                                                                </View>
                                                            </View>
                                                            {/* <View className="activity-result-item-head-info-detail at-row">
                                                                {
                                                                    // type 自定义选项类型（5 单行文本 1 多行文本 3 图片）
                                                                    item.customValue && item.customValue.map((element, index) => (
                                                                        element.type == '0' && <View className={index != (item.customValue.length - 1) ? 'hairline-right' : ''}>{element.value}</View>
                                                                    ))
                                                                }
                                                            </View> */}
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    );
                                })
                            )}
                            <View
                                className="loadmore"
                                onClick={this.loadmore.bind(this)}
                            >
                                
                                {
                                    lists.length > 0 && <AtDivider content={loadmore} />
                                }
                            </View>


                        </View>
                    </AtTabsPane>

                    <AtTabsPane current={this.state.currentTab} index={1}>
                        <View style="margin-top:0;">
                            <View className="activity-edit-form">
                                <View className="activity-edit-form-item-title">
                                    活动名称
                                </View>
                                <AtInput
                                    value={activityFormData.title}
                                    onChange={this.handleTitleChange.bind(this)}
                                    name=''
                                    placeholder="请输入活动名称"
                                    maxLength={255}
                                />

                                <View className="activity-edit-form-item-title">
                                    活动说明
                                </View>
                                <AtInput
                                    value={activityFormData.content}
                                    onChange={this.handleContentChange.bind(this)}
                                    name=''
                                    placeholder="请输入活动说明"
                                />

                                <View className="at-row activity-edit-form-item">
                                    <View className="at-col at-col-5">
                                        <View>开始时间</View>
                                        <View className="activity-edit-form-item-date">
                                            <Picker mode="date" value={activityFormData.startTime} onChange={this.onDateChange.bind(this, 'start')} disabled={isBegin}>
                                                <View className="picker">
                                                    {startTimeFormat}
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                    <View className="at-col at-col-2">
                                        <AtIcon
                                            prefixClass="icon icon-lujing"
                                            value="chevron-right"
                                            size="36"
                                            color="#ccc"
                                        />
                                    </View>
                                    <View className="at-col at-col-5">
                                        <View>结束时间</View>
                                        <View className="activity-edit-form-item-date">
                                            <Picker mode="date" value={activityFormData.endTime} onChange={this.onDateChange.bind(this, 'end')} disabled={isEnd}>
                                                <View className="picker">
                                                    {endTimeFormat}
                                                </View>
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <View className="at-row activity-edit-form-item">
                                    <View
                                        className="at-col at-col-5"
                                        style="line-height: 90rpx;"
                                    >
                                        <View>设置活动封面</View>
                                    </View>
                                    <View className="at-col at-col-6" onClick={this.chooseCover}>
                                        <Image
                                            src={process.env.apiBackImgPre + activityFormData.cover}
                                            mode="aspectFit"
                                            onError={e => {
                                            }}
                                            className="activity-edit-form-item-img"
                                        />
                                    </View>
                                    <View
                                        className="at-col at-col-1"
                                        style="line-height: 90rpx;"
                                    >
                                        <AtIcon
                                            prefixClass="icon icon-youjiantou"
                                            value="chevron-right"
                                            size="12"
                                            color="#ccc"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="activity-edit-form">

                                <View className='at-row activity-edit-form-item' onClick={this.handleChooseStartOrg}>
                                    <View className='at-col at-col-5'>
                                        <View>发起组织</View>
                                    </View>
                                    <View className='at-col at-col-6'>
                                        <View className='activity-edit-form-item-content'>{checkedOrg.name}</View>
                                    </View>
                                    <View className='at-col at-col-1'>
                                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                                    </View>
                                </View>


                                <View className="at-row activity-edit-form-item">
                                    <View className="at-col at-col-5">
                                        <View>参与组织</View>
                                    </View>
                                    <View className="at-col at-col-6" onClick={this.handleChooseOrg}>
                                        <View className="activity-edit-form-item-content">
                                            {checkedOrgList.length}个组织
                                        </View>
                                    </View>
                                    <View className="at-col at-col-1">
                                        <AtIcon
                                            prefixClass="icon icon-youjiantou"
                                            value="chevron-right"
                                            size="12"
                                            color="#ccc"
                                        />
                                    </View>
                                </View>

                                <View className="at-row activity-edit-form-item">
                                    <View className="at-col at-col-5">
                                        <View>参与人员</View>
                                    </View>
                                    <View className="at-col at-col-6" onClick={this.handleChooseUser}>
                                        <View className="activity-edit-form-item-content">
                                            {
                                                checkedUserList && checkedUserList.map((item, index) => (
                                                    index < 3 && <Dimage src={item.avatar} type='avatar' />
                                                ))
                                            }
                                            等{checkedUserList.length}人
                                        </View>
                                    </View>
                                    <View className="at-col at-col-1">
                                        <AtIcon
                                            prefixClass="icon icon-youjiantou"
                                            value="chevron-right"
                                            size="12"
                                            color="#ccc"
                                        />
                                    </View>
                                </View>

                                <View className="at-row activity-edit-form-item">
                                    <View className="at-col at-col-5">
                                        <View>群众可参与</View>
                                    </View>
                                    <View className="at-col at-col-7">
                                        <View
                                            className="activity-edit-form-item-content"
                                            style="padding-right: 32rpx;"
                                        >
                                            {activityFormData.peopleJoin == '1' ? '是' : '否'}
                                        </View>
                                    </View>
                                </View>

                                <View className="activity-edit-form-btn">
                                    <AtButton type="primary" onClick={this.saveActivity}>保存</AtButton>

                                    <AtButton
                                        type="secondary"
                                        className="activity-edit-form-btn-del"
                                        onClick={this.deleteActivityById}
                                    >
                                        删除
                                    </AtButton>
                                </View>
                            </View>
                        </View>
                    </AtTabsPane>
                </AtTabs>

                <DjLoading isshow={loading} />
            </View>
        );
    }
}

export default Edit;
