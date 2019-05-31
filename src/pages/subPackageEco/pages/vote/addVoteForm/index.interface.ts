/**
 * addVoteForm.state 参数类型
 *
 * @export
 * @interface AddVoteFormState
 */
export interface AddVoteFormState {
    data: any
    activityOption: Array<IactList>
    atcAddIcon: string
    atcDeletIcon: string
    
}

/**
 * 用户填写选择
 */
export interface IactList{
    title: string
    remark: string 
    cover: string
}

/**
 * addVoteForm.props 参数类型
 *
 * @export
 * @interface AddVoteFormProps
 */
export interface AddVoteFormProps {
    dispatch: any
    activityOption: Array<IactList>
    index?:any
    cover?: any
    title?: any
    remark?: any
}
