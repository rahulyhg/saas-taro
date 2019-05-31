import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Picker, Block, Text } from "@tarojs/components";
import { AtTextarea, AtButton, AtIcon, AtTabs, AtTabsPane, AtDivider } from "taro-ui";
import { connect } from "@tarojs/redux";
import { IeditProps, IeditState } from "./index.interface";
import Dimage from '../../../../pages/common/dimage'
const remoteImgPreUrl = process.env.remoteImgPreUrl;
import "./index.scss";
import { element } from "prop-types";

@connect(({ actEditAndResult, activityOrg, activityUser, orgSinglePopView }) => ({
    ...actEditAndResult,
    oldCheckedOrgList: activityOrg.oldCheckedOrgList,
    oldCheckedUserList: activityUser.oldCheckedUserList,
    checkedOrgList: activityOrg.checkedOrgList,
    checkedUserList: activityUser.checkedUserList,
    checkedOrg: orgSinglePopView.checkedOrg

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
            loadmore: ""
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
                title: e.detail.value
            }
        })
    }

    // 内容
    handleContentChange = e => {
        this.setState({
            activityFormData: {
                ...this.state.activityFormData,
                content: e.detail.value
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
            url: '/subPackageEco/pages/user/index?orgId=' + this.props.checkedOrg.id
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
        })
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
                    }).then(res => console.log(res.confirm, res.cancel));
                }
            }
        });
    }
    // 列表 加载更多 点击事件
    loadmore() {
        this.activityResult('', this.state.pageNum)
    }

    // 发起组织
    handleChooseStartOrg = e => {
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


        this.setState({
            activityFormData: this.props.activityFormData,
            checkedOrgList: this.props.checkedOrgList,
            checkedUserList: this.props.checkedUserList
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
                cover
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
    dateFormat = (e, t) => {
        var n = new Date(e), r = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "h+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds()
        };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var o in r) new RegExp("(" + o + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? r[o] : ("00" + r[o]).substr(("" + r[o]).length)));
        return t;
    }

    render() {

        const { tabList, lists, loadmore, noDataImg, checkedOrgList, checkedUserList } = this.state;
        const { activityFormData } = this.state;
        const { checkedOrg } = this.props;
        const startTimeFormat = this.dateFormat(this.state.activityFormData.startTime, 'yyyy年MM月dd日');
        const endTimeFormat = this.dateFormat(this.state.activityFormData.endTime, 'yyyy年MM月dd日');

        console.error(activityFormData)
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
                            {lists ? (
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
                                                            <View className="activity-result-item-head-info-detail at-row">
                                                                {
                                                                    // type 自定义选项类型（5 单行文本 1 多行文本 3 图片）
                                                                    item.customValue && item.customValue.map(element => (
                                                                        element.type == '0' && <View className='at-col at-col-3'>{element.value}</View>
                                                                    ))
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    );
                                })
                            ) : (
                                    <View className="nodata">
                                        <Image
                                            className="nodata-img"
                                            src={noDataImg}
                                            mode="aspectFit"
                                        />
                                        <AtDivider content='暂无数据' />

                                    </View>
                                )}
                            <View
                                className="loadmore"
                                onClick={this.loadmore.bind(this)}
                            >
                                <AtDivider content={loadmore} />
                            </View>


                        </View>
                    </AtTabsPane>

                    <AtTabsPane current={this.state.currentTab} index={1}>
                        <View style="margin-top:42px;">
                            <View className="activity-edit-form">
                                <View className="activity-edit-form-item-title">
                                    活动名称
                                </View>
                                <AtTextarea
                                    count={false}
                                    value={activityFormData.title}
                                    height="36"
                                    onChange={this.handleTitleChange.bind(this)}

                                    maxLength={50}
                                    placeholder="请输入活动名称"
                                />

                                <View className="activity-edit-form-item-title">
                                    活动说明
                                </View>
                                <AtTextarea
                                    count={false}
                                    value={activityFormData.content}
                                    height="36"
                                    onChange={this.handleContentChange.bind(this)}

                                    maxLength={50}
                                    placeholder="请输入活动说明"
                                />

                                <View className="at-row activity-edit-form-item">
                                    <View className="at-col at-col-5">
                                        <View>开始时间</View>
                                        <View className="activity-edit-form-item-date">
                                            <Picker mode="date" value={activityFormData.startTime} onChange={this.onDateChange.bind(this, 'start')}>
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
                                            <Picker mode="date" value={activityFormData.endTime} onChange={this.onDateChange.bind(this, 'end')}>
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
                                                console.warn("imgError", e);
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
            </View>
        );
    }
}

export default Edit;
