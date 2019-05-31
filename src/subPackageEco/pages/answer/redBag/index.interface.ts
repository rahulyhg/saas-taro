/**
 * redBag.state 参数类型
 *
 * @export
 * @interface RedBagAnswerState
 */
export interface RedBagAnswerState {
    switchValue: boolean
    formList: any
}

/**
 * redBag.props 参数类型
 *
 * @export
 * @interface RedBagAnswerProps
 */
export interface RedBagAnswerProps {
    dispatch?:any
    redNeed: string
    redTotalNum: number
    redMoney: number
    redTotal:number
    redPayTotal:number
}
