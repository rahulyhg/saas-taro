

/**
 * activity.state 参数类型
 *
 * @export
 * @interface ActivityState
 */
export interface ActivityState {
    activityTitleActive: boolean
    activityExplainActive: boolean
    activityFormData: ActivityForm | any,
    checkedUserList: any
    checkedOrgList: any
    filePath: string
}

/**
 * activity.props 参数类型
 *
 * @export
 * @interface ActivityProps
 */
export interface ActivityProps {
    dispatch?: any
    checkedOrgList: []
    checkedUserList: []
    checkedOrg:any
}


interface Org {
    orgId: string
    orgName: string
}
interface User {
    userId: string
    userName: string
    avatar: string
}
interface OptionItem {
    activityId: string
    type: string
    optionType: string
    name: string
    must: string
}
interface ActivityForm {
    id: string
    title: string
    cover: string
    content: string
    startTime: string
    endTime: string
    peopleJoin: string
    joinOrg: Org[]
    joinUser: User[]
    customOption: OptionItem[]
}