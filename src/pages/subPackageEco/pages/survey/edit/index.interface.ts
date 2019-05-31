interface IFormData {
    id: string
    title: string
    coverId: string
    cover: string
    content: string
    startTime: string
    endTime: string
    peopleJoin: number,
    orgs: [],
    users: [],
    redNeed: string
    redTotalNum: string
    redMoney: string
    redTotal: string
    redPayTotal: string
    redPlatform: number,
    customOptions: [],
    questions: []
    redGetNum:number
}
/**
 * edit.state 参数类型
 *
 * @export
 * @interface EditState
 */
export interface EditState {
    currentTab: number
    surveyFormData: IFormData
    checkedOrgList:any[]
    checkedUserList:any[]
    redPayTotal:any
    redTotalNum:number
    redNeed:number
}

/**
 * edit.props 参数类型
 *
 * @export
 * @interface EditProps
 */
export interface EditProps {
    dispatch?: any
    surveyFormData: any
    surveyResult:any
    checkedOrgList:any
    checkedUserList:any
    oldCheckedOrgList:any
    oldCheckedUserList:any
    checkedOrg:any
}
