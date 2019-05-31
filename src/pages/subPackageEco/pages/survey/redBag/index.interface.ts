/**
 * redBag.state 参数类型
 *
 * @export
 * @interface RedBagState
 */
export interface RedBagState {
    switchValue: boolean
    formList: any
}

/**
 * redBag.props 参数类型
 *
 * @export
 * @interface RedBagProps
 */
export interface RedBagProps {
    dispatch?:any
    redNeed: string
    redTotalNum: number
    redMoney: number
    redTotal:number
    redPayTotal:number
}
