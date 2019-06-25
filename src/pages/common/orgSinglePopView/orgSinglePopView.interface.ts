/**
 * OrgPopView.state 参数类型
 *
 * @export
 * @interface OrgSinglePopViewState
 */
export interface OrgSinglePopViewState {
    list: Array<OrgInterface>
    isSearch: boolean
    breadList: Array<any>
    inputName:string
}

/**
 * OrgPopView.props 参数类型
 *
 * @export
 * @interface OrgSinglePopViewProps
 */
export interface OrgSinglePopViewProps {
    dispatch?: any,
    maxOrg: any,
    list: Array<OrgInterface>,
    searchList: Array<OrgInterface>,
    checkedOrg: OrgInterface
    loading:boolean
}

export interface OrgInterface {
    name: string
    id: string
    code: string
    checked: boolean
    typeId:string
    
}
