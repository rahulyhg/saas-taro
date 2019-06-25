/**
 *
 * @export
 * @interface IState
 */
export interface IState {
    djclass?: string;
    loading: boolean;
    showNoData: boolean;
    datas?: any;
    listName?: string;
    status: 'more' | 'loading' | 'noMore';
}

/**
 *
 * @export
 * @interface IProps
 */
export interface IProps {
    dispatch?: any;
    /** 当前页面已加载了多少 */
    pageTotal?: number;
    /** 有问题时用于检测是哪个页面调用出问题 */
    listName?: string;
    /** 加载状态 */
    loading?: boolean;
    /** list */
    children?: any;
    /** 刚通过request获取的数据源 */
    datas?: any;
    /** 无数据时配置项 */
    noDataConfig?: {
        stylevalue?: string,
        imgStyle?: string,
        notice?: string
    }
}
