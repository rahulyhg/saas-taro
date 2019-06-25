/**
 * userPopView.state 参数类型
 *
 * @export
 * @interface UserPopViewState
 */
export interface UserPopViewState {
    isSearch:boolean,
    searchValue:string,
    breadList: Array<any>,
    orgList:Array<OrgInterface>,
    userList:Array<UserInterface>,
    searchUserList:Array<UserInterface>,
    checkedOrgList:Array<CheckedOrgInterface>,
    checkedUserList:Array<UserInterface>,
    allChecked:Boolean,
    count:Number
}

/**
 * userPopView.props 参数类型
 *
 * @export
 * @interface UserPopViewProps
 */
export interface UserPopViewProps {
    dispatch?: any,
    maxOrg?: any,
    orgList:Array<OrgInterface>,
    userList:Array<UserInterface>,
    searchUserList:Array<UserInterface>,
    checkedOrgList:Array<CheckedOrgInterface>,
    checkedUserList:Array<UserInterface>,
    orgUserList:Array<UserInterface>
    checkedList:any[]
    loading:boolean
}

export interface OrgInterface {
    orgName: string
    orgId: string
    orgCode: string
    checked: boolean
    allUser:any
}

export interface CheckedOrgInterface {
    orgName: string
    orgId: string
}

export interface UserInterface {
    avatar:string
    userName: string
    userId: string
    checked: boolean
    mobilePhone:string
    partyUserId:string
}
