/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
    current: number
    tabs: any
    demoImg: string
    noDataImg: string
    playIcon: string
    spectIcon: string
    pickerLogo: string
    arrDown: string
    orgList: any
    checkedIcon: string
    orgListCurIndex: number
    showCheckCover: boolean
}
  
  /**
   * index.props 参数类型
   *
   * @export
   * @interface IndexProps
   */
export interface IndexProps {
    dispatch?: any
    data: any

}
