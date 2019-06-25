
interface IMenu {
    /** 标题、主键 */
    title: string;
    icon: string;
    iconColor?: string,
    /** 跳转地址 与 onClick互斥 */
    url?: string;
    /** item后的副标题 */
    subTitle?: string;
    /** item后的描述 */
    subDesc?: string;
    /** item后的icon */
    subIcon?: string;
    /** 点击事件 与 url互斥 */
    onClick?: () => {};
}

/**
 * home.state 参数类型
 *
 * @export
 * @interface IState
 */
export interface IState {
    /** 信息栏grid菜单 */
    gridMenus: IMenu[];
    /** 菜单列表 */
    menus: IMenu[];
}

/**
 * home.props 参数类型
 *
 * @export
 * @interface IProps
 */
export interface IProps {
    dispatch?: any;
}
