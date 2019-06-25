declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
declare const process: {
    env: {
        /** taro的环境 */
        TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt';
        [key: string]: any;
        /** node环境 */
        NODE_ENV: 'production';
        /** 上传的图片的域名 */
        apiBackImgPre: string;
        /** OSS图片路径 */
        remoteImgPreUrl: string;
        /** token保存的键值名 */
        tokenKey: string;
        /** 是否打开redux日志 */
        openReduxLogger: boolean;
        /** web-view页面前缀，即PC端页面前缀路径 */
        pcPageHost: string;
    }
}

/** 支付宝小程序api */
declare const my: {
    getAuthCode: any;
}
