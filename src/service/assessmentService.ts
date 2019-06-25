/**
 * description: 考核
 * author: 守破离
 * date: 20190624
 */
import { IResponse } from 'types/IResponse';
import { Request } from '../utils/request'

/**
 * 考评申报、修改
 * @param param IAddEvluationRepor
 */
export const addEvluationRepor = (param: IAddEvluationReport):Promise<IResponse<any>> => {
    return Request.creatRequests({
        url: '/api/evaluation/addEvluationReport',
        method: 'POST',
        data: param,
    })
}

/**
 * 考评申报、修改
 * @param param IAddEvluationRepor
 */
export const getDetailById = (param: IGetDetailById):Promise<IGetDetailById> => {
    return Request.creatRequests({
        url: '/api/evaluation/getDetailById',
        data: param,
    })
}

/**
 * 考评申报、修改
 * @param param IAddEvluationRepor
 */
export const getEvaluationResult = (param: IGetEvaluationResult):Promise<IGetEvaluationResult_Res> => {
    return Request.creatRequests({
        url: '/api/evaluation/getEvaluationResult',
        data: param,
    })
}

/**
 * 考评申报、修改
 * @param param IGetPageList
 */
export const getPageList = (param: IGetPageList):Promise<IGetPageList_Res> => {
    return Request.creatRequests({
        url: '/api/evaluation/getPageList',
        data: param,
    })
}

/**
 * 考评申报、修改
 * @param param IgetReportList
 */
export const getReportList = (param: IGetReportList):Promise<IGetReportList> => {
    return Request.creatRequests({
        url: '/api/evaluation/getReportList',
        data: param,
    })
}


export interface IAddEvluationReport {

    /** 工作描述 */
    appearContent: string;

    /** 上报日期yyyy-MM-dd */
    appearDate: string;

    /** 申报分值 */
    appearScore: number;

    /** 申报标题 */
    appearTitle: string;

    /** 考核周期参与对象id  */
    cycleEnterId: string;

    /** 考核规则id（党建考评列表的detailList里面数据的id */
    detailId: string;

    /** 附件id列表  */
    fileIdList: string[];

    /** 考评申报id（编辑的时候要有这个值，新增不要） */
    id: string;

    /** 考核主表id */
    mainId: string;

    /** 图片id列表 */
    pictureIdList: string[];

    /** 考核分类id */
    subjectId: string;
}

export interface IGetReportList {

    /** 党建考评列表的detailList里面数据的id */
    detailId: string;

    /** 党建考评列表的主表的里面数据的id */
    cycleEnterId: string;
}

export interface IGetReportList_Res {

    /** 已申报分值（剩余可上报分值=最大分值-已申报分值） */
    appearScore: number;

    /** 基本分值 */
    baseScore: number;

    /** 已上报的记录列表 */
    children: Array<IGetReportListInfo>;

    /** 考评内容 */
    content: string;

    /** 0对组织考核(orgName有值)1对人考核（sysUserName有值） */
    evaluationObjType: 0 | 1;

    /** 考评内容id */
    id: string;

    /** 最大分值 */
    maxScore: number;

    /** 考评项目(手机列表考评左下角那块，比如学习教育) , */
    name: string;

    /** 组织名称  */
    orgName: string;

    /** 人姓名 */
    sysUserName: string;
}

export interface IGetReportListInfo {

    /** 工作描述 , */
    appearContent: string;

    /** 上报日期格式yyyy-MM-dd：2019-06-21 , */
    appearDate: string;

    /** 申报分值 , */
    appearScore: number;

    /** 申报标题 , */
    appearTitle: string;

    /** 考核周期参与对象id , */
    cycleEnterId: string;

    /** 考核规则id（党建考评列表的detailList里面数据的id） , */
    detailId: string;

    fileList: string[];

    /** 考评申报id（编辑的时候要有这个值，新增不要） , */
    id: string;

    /** 考核主表id , */
    mainId: string;

    pictureList: string[];

    /** 考核分类id */
    subjectId: string;
}

export interface IGetPageList {

    /** 查询类型 0.待上报 1.已上报 2.查看结果 */
    state: string;

    /** 当前页数 */
    current: number;

    /** 每页条数 */
    pageSize: number;
}

export interface IGetPageList_Res {

    /** 周期名称（比如1月，第一季度等） , */
    cycleName: string;

    /** 考评内容列表  */
    detailList: Array<IGetPageListInfo>;

    endDate: string;

    /** 周期id  */
    id: string;

    /** type=0:组织名称 */
    orgName: string;

    /** 排名 */
    ranking: number;

    /** 分数 */
    score: number;

    /**  type=1：姓名 */
    sysUserName: string;

    /** 考核名称 */
    title: string;

    /** 类型：0组织 1个人 */
    type: 0 | 1;
}

export interface IGetPageListInfo {
    /** 已申报分值（剩余可上报分值=最大分值-已申报分值） */
    appearScore: number;

    /** 基本分值 */
    baseScore: number;

    /** 考评内容 */
    content: string;

    /** 考核周期参与对象id  */
    cycleEnterId: string;

    /** 0对组织考核(orgName有值)1对人考核（sysUserName有值） , */
    evaluationObjType: 0 | 1;

    /** 考评内容id , */
    id: string;

    /** 考核主表id  */
    mainId: string;

    /** 最大分值 */
    maxScore: number;

    /** 考评项目(手机列表考评左下角那块，比如学习教育)  */
    name: string;

    /** 组织名称 */
    orgName: string;

    /** 考核分类id  */
    subjectId: string;

    /** 人姓名 */
    sysUserName: string;
}

export interface IGetEvaluationResult {
    /** 党建考评列表的主表的里面数据的id */
    cycleEnterId: string;
}

export interface IGetEvaluationResult_Res {

    /** 周期名称 */
    cycleName: string;

    /** 组织名称(type=0)  */
    orgName: string;

    /** 排名列表 */
    rankList: Array<IGetPageListInfo>;

    /** 排名 */
    ranking: number;

    /** 组织内排名(个人直属组织内的排名) , */
    rankingOrg: number;

    /** 得分  */
    score: number;

    /** 考核标题  */
    title: string;

    /** 类型：0组织 1个人 , */
    type: 0 | 1;

    /** 用户姓名(type=1) */
    userName: string;
}

export interface IGetDetailById {

    /** 党建考评列表的detailList里面数据的id */
    detailId: string;

    /** 党建考评列表的主表的里面数据的id */
    cycleEnterId: string;
}

export interface IGetDetailById_Res {

    /** 已申报分值（剩余可上报分值=最大分值-已申报分值） */
    appearScore: number;

    /** 基本分值 */
    baseScore: number;

    /** 考评内容 */
    content: string;

    /** 考核周期参与对象id  */
    cycleEnterId: string;

    /** 0对组织考核(orgName有值)1对人考核（sysUserName有值） */
    evaluationObjType: number;

    /** 考评内容id , */
    id: string;

    /** 考核主表id  */
    mainId: string;

    /** 最大分值  */
    maxScore: number;

    /** 考评项目(手机列表考评左下角那块，比如学习教育) */
    name: string;

    /** 组织名称  */
    orgName: string;

    /** 考核分类id , */
    subjectId: string;

    /** 人姓名 */
    sysUserName: string;
}
