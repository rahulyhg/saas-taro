
/**
 * signUp.state 参数类型
 *
 * @export
 * @interface AnswerState
 */
export interface AnswerState {
    id: string,
    customValues: Array<any>,
    curIndex: number,
    customList: Array<any>,
    showCover:boolean
}

/**
 * signUp.props 参数类型
 *
 * @export
 * @interface AnswerProps
 */
export interface AnswerProps {
    dispatch: any,
    id:string,
    questions: Array<any>,
}
