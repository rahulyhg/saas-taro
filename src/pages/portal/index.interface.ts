export interface IState {
    /** 通过分享、通知、公众号消息进入后的直达地址 */
    redirect: string;
    appType?: string;
    authCode?: string;
}

export interface IProps {
    dispatch?: any;
    loading?: boolean;
}
