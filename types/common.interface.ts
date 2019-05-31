/**
 * commonState.state 参数类型
 *
 * @export
 * @interface AddAnswerFormState
 */
export interface commonState {
    toast: {
        text: string,
        isOpened: boolean,
        duration: number,
        hasMask: boolean,
        icon: 'close-circle' | 'check-circle',
        status: 'error' | 'loading' | 'success'
    }
}
