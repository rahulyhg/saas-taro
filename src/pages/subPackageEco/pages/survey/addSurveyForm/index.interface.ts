/**
 * addVoteForm.state 参数类型
 *
 * @export
 * @interface AddSurveyFormState
 */
export interface AddSurveyFormState {
    atcList: any
    atcAddIcon: string
    preTypes: any
    customTypes: any
    showAddTypeCover: boolean,
    atcDeletIcon: string,
    uncheckIcon:string
    questions:any[]
}

/**
 * addVoteForm.props 参数类型
 *
 * @export
 * @interface AddSurveyFormProps
 */
export interface AddSurveyFormProps { 
    dispatch?:any
    title:any
    questions:any[]
    customOptions:any[]
    preOptions:any[]
}
