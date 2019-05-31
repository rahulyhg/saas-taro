/**
 * edit.state 参数类型
 *
 * @export
 * @interface IeditState
 */
export interface IeditState {
    noDataImg: string
    tabList: any
    currentTab: number
    lists: any
    pageNum: number
    pageSize: number
    nodata: any
    loadmore: string
    activityFormData:any
    checkedOrgList:any
    checkedUserList:any
}

/**
 * edit.props 参数类型
 *
 * @export
 * @interface IeditProps
 */
export interface IeditProps {
    dispatch: any,
    activityFormData:any
    checkedOrgList:any
    checkedUserList:any
    oldCheckedOrgList:any
    oldCheckedUserList:any
    checkedOrg:any
}
