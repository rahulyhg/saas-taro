import {Request} from '@/src/utils/request'

// 取消收藏文章
export const cancelCollectArticle = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/cancelCollectArticle',
        method: 'POST',
        data: param
    });
}

// 收藏文章
export const collectArticle = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/collectArticle',
        method: 'POST',
        data: param
    });
}

// 获取文章详情
export const findArticleDetail = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findArticleDetail',
        method: 'GET',
        data: param
    });
}

// 查找文章列表
export const findArticleList = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findArticleList',
        method: 'GET',
        data: param
    });
}

// 根据党委站点的id查找可选支部列表，以及默认支部
export const findBranchSite = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findBranchSite',
        method: 'GET',
        data: param
    });
}

// 根据党委站点的id查找栏目列表
export const findColumnList = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findColumnList',
        method: 'GET',
        data: param
    });
}

// 获取用户的最大站点和可选的党委列表
export const findHomeSite = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findHomeSite',
        method: 'GET',
        data: param
    });
}

// 查找幻灯的文章
export const findSlideArticle = (param) => {
    return Request.creatRequests({
        url: '/api/cmsArticle/findSlideArticle',
        method: 'GET',
        data: param
    });
}
