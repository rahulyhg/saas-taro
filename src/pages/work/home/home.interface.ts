interface IWork {
    url:string;
    image:string;
    value:string;
}

/**
 * home.state 参数类型
 *
 * @export
 * @interface HomeState
 */
export interface HomeState {
    userWorks: IWork[];
    partyWorks: IWork[];
    hiddenModal: boolean;
    userInfo: any;
}

/**
 * home.props 参数类型
 *
 * @export
 * @interface HomeProps
 */
export interface HomeProps {
    dispatch?: any;
}
