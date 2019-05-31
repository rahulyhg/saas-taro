/**
 * detail.state 参数类型
 *
 * @export
 * @interface DetailState
 */
export interface DetailState {
    id: string,
    detail: {
        id: string                  //  主键
        sysUserCover: string,       //  用户头衔
        sysUserName: string,        //  用户名
        createTime: string,         //  创建时间
        content: string,            //  内容
        picList: Array<any>,        //  图片列表
        praiseList: Array<any>,     //  点赞列表
        praiseCount: number,        //  点赞数
        commentDTOList: Array<any>, //  评论列表
        commentCount: number,       //  评论数
        isPraise: boolean,          //  是否点赞
    },
    curCommentContent: string       //  评论框内容
    commentType: string             //  评论类型
    curBusinessId: string           //  评论业务id
    isShowFullContent: Boolean      //  控制展开、收起内容,
    isShowCommentTextarea: Boolean  //  控制展开、收起评论框,
}

/**
 * detail.props 参数类型
 *
 * @export
 * @interface DetailProps
 */
export interface DetailProps {
    dispatch: Function
}
