import { finished } from "stream";

/**
 * integralRank.state 参数类型
 *
 * @export
 * @interface IntegralRankState
 */
export interface IntegralRankState {
    list:any[],
    finished:boolean
    loading:boolean
    current:number
}

/**
 * integralRank.props 参数类型
 *
 * @export
 * @interface IntegralRankProps
 */
export interface IntegralRankProps {
    dispatch?:any
    detailList:any[]
}
