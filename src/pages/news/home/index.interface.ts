/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
    current: number,
    tabs: any,
    siteList: any,
    siteListCurIndex: number,
    showCheckCover: boolean,
    siteListChild: any,
    siteListChildIndex: number,
    nodata: boolean,
    [key:string]: any
}
  
  /**
   * index.props 参数类型
   *
   * @export
   * @interface IndexProps
   */
export interface IndexProps {
    dispatch?: any,
    data: any,
    [key:string]: any

}
