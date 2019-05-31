 /**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface CoordinationListState {
    current       : number
    tabs          : any
    workChargeList: any
    workJoinList  : any
    workSendList  : any
    showCheckCover: boolean
    checkList     : any
    checkType     : number

    arrDown       : string
    work_select_ok: string

}
 
 /**
   * index.props 参数类型
   *
   * @export
   * @interface IndexProps
   */
  export interface CoordinationListProps {
    dispatch?: any
    data     : any

}

