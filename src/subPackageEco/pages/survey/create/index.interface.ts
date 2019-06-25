/**
 * activity.state 参数类型
 *
 * @export 
 * @interface IcreateSurveyState
 */
export interface IcreateSurveyState {
    filePath:''
    surveyFormData: SurveyForm | any
    checkedUserList: any
    checkedOrgList: any
    activityTitleActive: boolean
    activityExplainActive: boolean
}

/**
 * activity.props 参数类型
 *
 * @export
 * @interface IcreateSurveyProps
 */
export interface IcreateSurveyProps {
    dispatch?:any
    checkedUserList:any[]
    checkedOrgList:any[],
    checkedOrg:any
}


interface SurveyForm {
    id: string
    title: string
    cover: string
    content: string
    startTime: string
    endTime: string
    peopleJoin: string
    orgIds: string[]
    userIds: string[]
    customOptions:[]
    questions:[]
}
