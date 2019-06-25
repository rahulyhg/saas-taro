import { create } from 'dva-core';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
import Taro from '@tarojs/taro';

let app
let store
let dispatch
let registered

function createApp(opt) {
    // redux日志
    // opt.onAction = [createLogger()]
    app = create(opt)
    app.use(createLoading({}))

    // 适配支付宝小程序
    if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
        global = {}
    }
    if (!registered) opt.models.forEach(model => app.model(model))
    registered = true
    app.start()

    store = app._store
    app.getStore = () => store
    app.use({
        onError(err) {
            console.log(err)
        },
    })

    dispatch = store.dispatch

    app.dispatch = dispatch
    return app
}

export default {
    createApp,
    getDispatch() {
        return app.dispatch
    }
}
