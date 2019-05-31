import { commonState } from '../../../../../types/common.interface'

/**
 * edit.state 参数类型
 *
 * @export
 * @interface EditState
 */
export interface EditState extends commonState{
    currentTab: number,
    checkedOrgList?:any[],
    checkedUserList?:any[],
    redPayTotal?:any,
    redTotalNum?:number,
    redNeed?:number,
    answerFormData: AnswerForm | any,
    rateColorArr: string[]
}

/**
 * edit.props 参数类型
 *
 * @export
 * @interface EditProps
 */
export interface EditProps {
    dispatch?: any,
    answerFormData: AnswerForm | any,
    answerResult:any,
    checkedOrgList:any,
    checkedUserList:any,
    oldCheckedOrgList:any,
    oldCheckedUserList:any
}

interface AnswerForm {
    id: string
    title: string
    cover: string
    content: string
    startDate: string
    endDate: string
    peopleJoin: string
    orgIds: string[]
    userIds: string[]
    customOptions:[]
    questions:[]
}
