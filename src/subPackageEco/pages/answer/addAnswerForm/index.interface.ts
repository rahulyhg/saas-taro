/**
 * addVoteForm.state 参数类型
 *
 * @export
 * @interface AddAnswerFormState
 */
export interface AddAnswerFormState {
    atcList: any
    atcAddIcon: string
    preTypes: any
    customTypes: any
    showAddTypeCover: boolean,
    atcDeletIcon: string,
    uncheckIcon:string,
    questions?:any[]
}

/**
 * addVoteForm.props 参数类型
 *
 * @export
 * @interface AddAnswerFormProps
 */
export interface AddAnswerFormProps {
    dispatch: any,
    title: string,
    questions:any[]
}
