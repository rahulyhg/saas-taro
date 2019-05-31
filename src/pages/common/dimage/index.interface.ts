/**
 * dimage.state 参数类型
 *
 * @export
 * @interface DimageState
 */
export interface DimageState {
    errorAvatarUrl: string,
    defaultAvatarUrl: string,
    errorImageUrl: string,
    defaultImageUrl: string
}

/**
 * dimage.props 参数类型
 *
 * @export
 * @interface DimageProps
 */
export interface DimageProps {
    src: string,
    styleValue?: string,
    type?: string,
    mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' |
    'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' |
    'bottom left' | 'bottom right'
}
