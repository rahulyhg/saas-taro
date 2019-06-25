/**
 * addTypesForm.state 参数类型
 *
 * @export
 * @interface AddTypesFormState
 */
export interface AddTypesFormState {
    grayDelet: string
    atcDeletIcon: string
    isShowDeletBtn: boolean
    index?: any

    title: string
    remark: string
    cover: string,
    isShowLoading: boolean
}

/**
 * addTypesForm.props 参数类型
 *
 * @export
 * @interface AddTypesFormProps
 */
export interface AddTypesFormProps {
    dispatch: any
}
