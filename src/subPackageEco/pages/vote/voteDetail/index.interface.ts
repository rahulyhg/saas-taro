/**
 * voteDetail.state 参数类型
 *
 * @export
 * @interface VoteDetailState
 */
export interface VoteDetailState {
    showCover: boolean,
    activityId: string,
    voteMoreDetail?: any,
    rtnData?: any,
    isShowLoading: boolean
}

/**
 * voteDetail.props 参数类型
 *
 * @export
 * @interface VoteDetailProps
 */
export interface VoteDetailProps {
    dispatch: Function
}
