/**
 * addTypesForm.state 参数类型
 *
 * @export
 * @interface AddActTypesFormState
 */
export interface AddActTypesFormState {
    grayDelet: string
    placeholder: string
    //isEdit:boolean,

    optionItem :{
        index:number
        activityId: string
        type: string
        optionType: string
        name: string
        must: string
    }
}

/**
 * addTypesForm.props 参数类型
 *
 * @export
 * @interface AddActTypesFormProps
 */
export interface AddActTypesFormProps {
    dispatch?:any,
    optionItem:any,
    atcList:any[],
}
