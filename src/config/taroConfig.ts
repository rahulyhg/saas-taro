/**
 * 进行taro的处理 
 * 1.方法的改写
 * 2.utils的挂载
 * 
 */
import Taro, { Component } from "@tarojs/taro";
import { shareInfo } from './index'

/**
 * navigateTo 超过8次之后 强行进行redirectTo 否则会造成页面卡死
 * 
 */
const nav = Taro.navigateTo
Taro.navigateTo = (data) => {
  if (Taro.getCurrentPages().length > 8) {
    return Taro.redirectTo(data)
  }
  return nav(data)
}

/** 切换tab 强制刷新当前页面 */
const go = Taro.switchTab
Taro.switchTab = (data) => {
  return go(data).then(() => {

    setTimeout(() => {
      let pages = Taro.getCurrentPages();
      console.error("pages", pages)
      const page = pages[pages.length - 1];
      console.error("page", page)
      if (page == undefined || page == null) {
        return
      } else {
        page.$component.componentDidMount();
      }
    }, 2000);
  })
}


/**
 * Component挂载分享方法
 */
Component.prototype.onShareAppMessage = function () {
  return shareInfo
}