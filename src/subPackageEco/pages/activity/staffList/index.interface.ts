/**
 * staffList.state 参数类型
 *
 * @export
 * @interface StaffListState
 */
export interface StaffListState {
    noDataImg: string
    staffList: Array<any>
    loadmore: string
    finished:boolean
    loading:false
    current:number
    pageSize:number
}
export interface ListData {
    headSrc: string
    name: string
    time: string
}

/**
 * staffList.props 参数类型
 *
 * @export
 * @interface StaffListProps
 */
export interface StaffListProps {
    dispatch?:any
    staffList:any[]
    loading:boolean
}
