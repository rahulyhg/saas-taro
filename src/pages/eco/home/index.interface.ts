
/**
 * eco.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
    list: Array<any>,
    pageCurrent: number,
    pageSize: number,
    isShowCommentTextarea: boolean,
    isShowPublic: boolean,
    finished: boolean,
    loading: boolean,
    uploading: boolean,
    curBusinessId: string,
    curCommentContent: string,
    commentType: string
}

/**
 * eco.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
    dispatch?: any;
    isPartake:boolean;
    tabCurrent: number;
}
