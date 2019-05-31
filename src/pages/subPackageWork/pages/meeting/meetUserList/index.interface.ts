/**
 * meetUserList.state 参数类型
 * 
 * @export
 * @interface ImeetUserListState
 */
export interface ImeetUserListState {
    inputMeetTit: string,
    meetTypeArray: any,
    meetTypeArrayIndex: number,
    tabs: any,
    curIndex: number,
    loading: boolean,
    [key:string]: any
}

/**
 * meetUserList.props 参数类型
 *
 * @export
 * @interface ImeetUserListProps
 */
export interface ImeetUserListProps {
    [key:string]: any
}
