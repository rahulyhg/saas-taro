
export interface RewardsPunishmentsListProps {
    dispatch?: any;
    tabList0: any;
    tabDatas0: any;
    tabList1: any;
    tabDatas1: any;
    tabData0ScrollTop: number;
    tabData1ScrollTop: number;
}
export interface ITab {
    code: any;
    title: string;
    datas?: Array<any>;
    nowDatas?: Array<any>; 
    loading?: boolean;
}
export interface RewardsPunishmentsListState {
    current: number;
    tabs?: any;
    hideSearchTool: boolean;
    checkedOrgIndex: number;
    checkedYearIndex: number;
    checkedOrgId: string | number;
    checkedYear: string | number;
    orgList?: any;
    years?: Array<number>;
}