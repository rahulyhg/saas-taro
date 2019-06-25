
export interface RewardsPunishmentsEditProps {
    dispatch?: any;
    checkedOrg?: any;
    checkedUsers?: any;
}
export interface RewardsPunishmentsEditState {
    type: Array<Object>;
    /** 当前选中的数组下标 */
    checkedTypeIndex: number;
    /** 当前选中的实际对象 */
    checkedType: any;
    model: any;
    /** 当前选中的数组下标 */
    checkedModelIndex: number;
    /** 当前选中的实际对象 */
    checkedModel: any;
    org?: Array<any>;
    name?: string;
    sendTime?: string;
    checkedOrg?: any;
    checkedUsers?: any;
    files?: Array<any>;
    showFiles?: Array<any>;
}