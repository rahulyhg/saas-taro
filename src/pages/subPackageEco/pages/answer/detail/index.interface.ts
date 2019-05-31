
/**
 * signUp.state 参数类型
 *
 * @export
 * @interface AnswerDetailState
 */
export interface AnswerDetailState {
    id: string,
    detail: {
        content: string,
        createByName: string,
        endTime: string,
        startTime: string,
        title: string,
        createByCover: string
    }
}

/**
 * signUp.props 参数类型
 *
 * @export
 * @interface AnswerDetailProps
 */
export interface AnswerDetailProps {
    dispatch: any
}
