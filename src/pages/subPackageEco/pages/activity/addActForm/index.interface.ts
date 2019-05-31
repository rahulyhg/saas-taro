/**
 * addActForm.state 参数类型
 *
 * @export
 * @interface AddActFormState
 */
export interface AddActFormState {
    atcList: any
    atcAddIcon: string
    atcDeletIcon: string
    preTypes: any
    customTypes: any
    showAddTypeCover: boolean
}

/**
 * addActForm.props 参数类型
 *
 * @export
 * @interface AddActFormProps
 */
export interface AddActFormProps {
    dispatch?:any
    isEdit:string
    atcList:any[]
    optionItem:any
    needHandle:boolean
    title:string
}
