export interface IState {
    bindType: 'phone' | 'account';
    phone?: string;
    verificationCode?: string;
    account?: string;
    password?: string;
    timer: number;
    hiddenModal: boolean;
    userInfo?: {
        authCode: string;
        nickName?: string;
        avatarUrl?: string;
    };
    redirect?: string;
}

export interface IProps {
    dispatch?: any;
    bindAccount: any;
    portal: any;
    loading: boolean;
}
