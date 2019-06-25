/**
 * recordIndex.state 参数类型
 *
 * @export
 * @interface RecordIndexState
 */
export interface RecordIndexState {
    activeTab:string
    yearList:string[]
    monthList:string[]
    itemList:string[]
    year:string,
    month:string
}

/**
 * recordIndex.props 参数类型
 *
 * @export
 * @interface RecordIndexProps
 */
export interface RecordIndexProps {
    dispatch?:any
    rankDetail:any
}
