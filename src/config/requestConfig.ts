import userAndOrgUtilService from '../service/userAndOrgUtilService'

/** 
 * 请求的公共参数
 */
export const commonParame = {}

/**
 * 请求映射文件
 */
export const requestConfig = {
  // ...loginService,
  ...userAndOrgUtilService,
}