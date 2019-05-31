
import index from '../pages/index/model';// 新闻首页 model
import newsIndex from '../pages/news/home/model';// 新闻首页 model
import newsDetail from '../pages/news/newsDetail/model';// 新闻详情页 model
import demo from '../pages/demo/model';
import userPopView from '../pages/common/userPopView/model';
import orgPopView from '../pages/common/orgPopView/model';
import orgSinglePopView from '../pages/common/orgSinglePopView/model';
import userSinglePopView from '../pages/common/userSinglePopView/model';
import addActForm from './addActForm'; // 新增 活动题目类别 表单
import activity from './activity';
import activityPreOption from './activityPreOption';
import activityOrg from './activityOrg';
import activityUser from './activityUser';
import activityDetail from './activityDetail';
import activitySignUp from './activitySignUp';
import survey from './survey';
import surveyEdit from './surveyEdit';
import surveyJoin from './surveyJoin';

import actEditAndResult from './actEditAndResult'; // 新增 活动题目类别 表单
import addVoteTypesForm from './addVoteTypesForm'
import addVoteForm from './addVoteForm'; // 新增 活动题目类别 表单
import voteEdit from './voteEdit'; // 新增 活动题目类别 表单
import voteDetail from './voteDetail';    //生态圈首页
import eco from '../pages/eco/home/model';    //生态圈
import meetUserList from './meetUserList';    //会议列表 -用户
import meetManageList from './meetManageList';    //会议列表 -管理
import meetUserDetail from './meetUserDetail';    //会议 详情 - 用户
import meetManageDetail from './meetManageDetail';    //会议 详情 - 管理
import meetRelease from './meetRelease';    //会议 发布
import meetMsgMind from './meetMsgMind';    //会议 消息提醒
import meetOrgAndUserList from './meetOrgAndUserList';    //会议 组织列表及人员列表 公用页面

import examExplain from './examExplain';// 考试
import examList from './examList';// 考试
import examResultA from './examResultA';// 考试
import examResultB from './examResultB';// 考试
import examSubjects from './examSubjects';// 考试
import examSuccess from './examSuccess';// 考试
import workHomeModel from '../pages/work/home/model';// 考试


// import examList from './examList';    // 考试列表

import answer from './answer';    //趣味答题

import common from './common';    //公共



export default [
	index,
	newsIndex,
    newsDetail,
    demo,
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

]
