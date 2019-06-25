

/**
 * public.state 参数类型
 *
 * @export
 * @interface PublicState
 */
export interface PublicState {
    fileArr: Array<any>,
    picArray: any,
    content: string,
    isLocation: boolean,
    textAreaHeight: number,
    lat: number,
    lng: number
}

/**
 * public.props 参数类型
 *
 * @export
 * @interface PublicProps
 */
export interface PublicProps {
    dispatch: any
}
