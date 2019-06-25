import { finished } from "stream";

/**
 * loading.state 参数类型
 *
 * @export
 * @interface LoadingState
 */
export interface LoadingState {
    status?: 'more' | 'loading' | 'noMore',
    isShow: boolean
}

/**
 * loading.props 参数类型
 *
 * @export
 * @interface LoadingProps
 */
export interface LoadingProps {
    loading: boolean,
    finished: boolean
}
