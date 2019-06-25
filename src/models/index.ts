import news from '../pages/news/home/model';// 新闻首页 model
import newsDetail from '../pages/news/newsDetail/model';// 新闻详情页 model
import userPopView from '../pages/common/userPopView/model';
import orgPopView from '../pages/common/orgPopView/model';
import orgSinglePopView from '../pages/common/orgSinglePopView/model';
import userSinglePopView from '../pages/common/userSinglePopView/model';
import addActForm from './addActForm'; // 新增 活动题目类别 表单
import activity from './eco/activity/activity';
import activityPreOption from './eco/activity/activityPreOption';
import activityOrg from './eco/activity/activityOrg';
import activityUser from './eco/activity/activityUser';
import activityDetail from './eco/activity/activityDetail';
import activitySignUp from './eco/activity/activitySignUp';
import survey from './eco/survey/survey';
import surveyEdit from './eco/survey/surveyEdit';
import surveyJoin from './eco/survey/surveyJoin';

import actEditAndResult from './eco/activity/actEditAndResult'; // 新增 活动题目类别 表单
import addVoteTypesForm from './eco/vote/addVoteTypesForm'
import addVoteForm from './eco/vote/addVoteForm'; // 新增 活动题目类别 表单
import voteEdit from './eco/vote/voteEdit'; // 新增 活动题目类别 表单
import voteDetail from './eco/vote/voteDetail';    //生态圈首页
import eco from '../pages/eco/home/model';    //生态圈
import meetUserList from './works/meeting/meetUserList';    //会议列表 -用户
import meetManageList from './works/meeting/meetManageList';    //会议列表 -管理
import meetUserDetail from './works/meeting/meetUserDetail';    //会议 详情 - 用户
import meetManageDetail from './works/meeting/meetManageDetail';    //会议 详情 - 管理
import meetRelease from './works/meeting/meetRelease';    //会议 发布
import meetMsgMind from './works/meeting/meetMsgMind';    //会议 消息提醒
import meetOrgAndUserList from './works/meeting/meetOrgAndUserList';    //会议 组织列表及人员列表 公用页面
import meetLivePlayer from './works/meeting/meetLivePlayer';    // 视频播放
import meetLivePusher from './works/meeting/meetLivePusher';    // 视频直播

import webView from './works/webView/webView';    // webView

import examExplain from './works/exam/examExplain';// 考试
import examList from './works/exam/examList';// 考试
import examResultA from './works/exam/examResultA';// 考试
import examResultB from './works/exam/examResultB';// 考试
import examSubjects from './works/exam/examSubjects';// 考试
import examSuccess from './works/exam/examSuccess';// 考试
import workHomeModel from '../pages/work/home/model';// 考试
import coordinationModel from './coordinationModel';// 工作协同

/** 奖惩 */
import rewardsPunishmentsList from './works/rewardsPunishments/listModel'


//考核
import assessmentModel from './works/assessment/assessmentModel'

//工作协同列表
import coordinationListModel from './coordinationList'
//工作协同新增
import coordinationSendModel from './coordinationSend'

// import examList from './examList';    // 考试列表

import answer from './answer';    //趣味答题

import common from './common';    //公共

import popView from './popView'
import djLoading from '../pages/common/djLoading/model'


import appraise from './appraise';  // 民主评议
import portal from '../pages/portal/model' // 欢迎页
import bindAccount from '../pages/bindAccount/model' // 绑定账号
// import integralRank from '@/subPackageWork/pages/integralRank/model' // 积分排行
// import rankDetail from '@/subPackageWork/pages/rankDetail/model' // 个人积分记录

// 党费
import partyFee from './works/dues/partyFee'
// 党费

// 党员调动
import partyTransfer from './works/transfer/partyTransfer'
// 党员调动

// 党员流动
import turnover from './turnover'

import dictionary from './dictionary'

// 积分
import integral from './works/integral/index'

export default [
    // integralRank,
    // rankDetail,
    portal,
    bindAccount,
	news,
    newsDetail,
    userPopView,
    orgPopView,
    orgSinglePopView,
    userSinglePopView,
    actEditAndResult,
    addActForm,
    activity,
    activityPreOption,
    activityOrg,
    activityUser,
    activityDetail,
    activitySignUp,
    addVoteForm,
    addVoteTypesForm,
    voteEdit,
    voteDetail,
    eco,
    meetUserList,
    meetManageList,
    meetManageDetail,
    meetUserDetail,
    meetRelease,
    meetOrgAndUserList,
    meetLivePusher,
    meetLivePlayer,
    webView,
    
    examExplain,
    examList,
    examResultA,
    examResultB,
    examSubjects,
    examSuccess,

    survey,
    surveyEdit,
    surveyJoin,
    meetMsgMind,
    common,
    answer,

    workHomeModel,


    coordinationListModel,
    coordinationSendModel,

    popView,
    djLoading,

    rewardsPunishmentsList,
    coordinationModel,

    appraise,
    partyFee,
    partyTransfer,

    turnover,
    dictionary,
    integral,
    assessmentModel
]
