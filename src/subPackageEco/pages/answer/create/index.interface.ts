import { commonState } from '../../../../../types/common.interface'

/**
 * activity.state 参数类型
 *
 * @export
 * @interface AnswerState
 */
export interface AnswerState extends commonState {
    answerFormData: AnswerForm | any,
    filePath: string,
    checkedUserList: any
    checkedOrgList: any
    answerTitleActive: boolean,
    answerExplainActive: boolean
}

/**
 * activity.props 参数类型
 *
 * @export
 * @interface AnswerProps
 */
export interface AnswerProps {
    dispatch: any,
    checkedUserList:any[],
    checkedOrgList:any[]
}

interface AnswerForm {
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
