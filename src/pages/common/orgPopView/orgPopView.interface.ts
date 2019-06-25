/**
 * OrgPopView.state 参数类型
 *
 * @export
 * @interface OrgPopViewState
 */
export interface OrgPopViewState {
    isSearch: boolean,
    searchValue: string,
    breadList: any,
    orgList: any[],
    checkedOrgList: any[],
    allChecked: Boolean,
    count: Number,
    maxOrg?: any,
    searchOrgList:any[],
}

/**
 * OrgPopView.props 参数类型
 *
 * @export
 * @interface OrgPopViewProps
 */
export interface OrgPopViewProps {
    dispatch?: any
    maxOrg?: any
    orgList: any[]
    searchOrgList:any[]
    checkedList:any[]
    loading:boolean


}

export interface OrgInterface {
    id: string
    name: string
    checked: boolean
    code:string
    typeId:string
    shortName:string
}
