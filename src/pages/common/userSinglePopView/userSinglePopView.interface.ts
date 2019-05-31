/**
 * UserSinglePopView.state 参数类型
 *
 * @export
 * @interface UserSinglePopViewState
 */
export interface UserSinglePopViewState {
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
 * UserSinglePopView.props 参数类型
 *
 * @export
 * @interface UserSinglePopViewProps
 */
export interface UserSinglePopViewProps {
    dispatch?: any,
    maxOrg?: any,
    orgList:Array<OrgInterface>,
    userList:Array<UserInterface>,
    searchUserList:Array<UserInterface>,
    checkedOrgList:Array<CheckedOrgInterface>,
    checkedUserList:Array<UserInterface>,
    orgUserList:Array<UserInterface>
}

export interface OrgInterface {
    name: string
    id: string
    checked: boolean,
    allUser:any
}

export interface CheckedOrgInterface {
    name: string
    id: string
}

export interface UserInterface {
    userName: string
    id: string
    checked: boolean
}
