
 /**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface SendCoordinationState {
    workTitle           : string
    endTime             : string
    chooseType          : number

    chargePeople        : any
    checkedOrgList      : any
    checkedJoinUserList : any
    checkWhoCanWatchList:any

}
 
 /**
   * index.props 参数类型
   *
   * @export
   * @interface IndexProps
   */
  export interface SendCoordinationProps {
    dispatch?      : any

    checkedOrgList : []
    checkedUserList: []
    chargePeople   : []

}

