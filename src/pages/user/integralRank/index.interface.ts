/**
 * integralRank.state 参数类型
 *
 * @export
 * @interface IntegralRankState
 */
export interface IntegralRankState {
    activeTab:string
    yearList:string[]
    monthList:string[]
    itemList:string[]
    year:string,
    month:string,
    current:number
    pageSize:number
    currentTab:number
    list:any
    finished:boolean
    loading:boolean
}

/**
 * integralRank.props 参数类型
 *
 * @export
 * @interface IntegralRankProps
 */
export interface IntegralRankProps {
    dispatch?:any
    personRank:any
}
