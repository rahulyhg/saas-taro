/**
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
    tabCurrent: number,
    dynamicList: Array<any>,
    commentList: Array<any>,
    commentActionSheetVisiable: boolean,
    replayName: string
    // list: Array<any>,
    // tabCurrent: number,
    // pageCurrent: number,
    // pageSize: number,
    // isShowCommentTextarea: boolean,
    // isShowPublic: boolean,
    // finished: boolean,
    // loading: boolean,
    // curBusinessId: string,
    // curCommentContent: string,
    // commentType: string



    //以下是处理 模块
    righr_arrow         : string
    work_no_start       : string
    work_doing          : string
    work_finish         : string
    work_charge_people  : string

    workTitle           : string
    chargePeople        : any
    checkedOrgList      : any
    chooseType          : number
    checkedJoinUserList : any
    checkWhoCanWatchList: any
     
}

/**
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
    // dispatch?: any

    checkedOrgList : []
    checkedUserList: []
    chargePeople   : []
}
