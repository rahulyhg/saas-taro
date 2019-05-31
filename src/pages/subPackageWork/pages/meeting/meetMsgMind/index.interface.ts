/**
 * meetUserList.state 参数类型
 * 
 * @export
 * @interface ImeetMsgMindState
 */
export interface ImeetMsgMindState {
    msg_out_check: boolean,
    msg_sys_check: boolean,
    prePageData: any,
    cancelUserList: any, 
    newUserList: any, 
    relUserList: any, 
    msg: string,// 新增 短信消息内容
    cancelMsg: string,// 取消短信消息内容
}

/**
 * meetUserList.props 参数类型
 *
 * @export
 * @interface ImeetMsgMindProps
 */
export interface ImeetMsgMindProps {
    dispatch: any
}
