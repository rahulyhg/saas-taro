
/**
 * api 接口返回值基类
 */
export interface IResponse<T> {
    code: -1 | 1;
    msg: string;
    data: T;
    success: boolean;
}
