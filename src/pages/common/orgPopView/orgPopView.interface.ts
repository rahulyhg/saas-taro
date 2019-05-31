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
    checkedOrgList: Array<OrgInterface>,
    allChecked: Boolean,
    count: Number,
    maxOrg?: any,
    searchOrgList:Array<OrgInterface>
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
    list: Array<OrgInterface>
    type?: string
    allChecked?: boolean
    breadList?: Array<OrgInterface>
    checkedList: any[]
    checkedOrgList: any[]
    searchOrgList: Array<OrgInterface>
}

export interface OrgInterface {
    id: string
    name: string
    checked: boolean
    code:string
    typeId:string
    shortName:string
}
