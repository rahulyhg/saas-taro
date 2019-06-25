import * as assessmentApi from '@/src/service/assessmentService';

export default {
    namespace: 'assessment',
    state: {
        // 个人
        tabList1: [],
        tabDatas1: [],
        tabData1ScrollTop: 0,

        // 组织
        tabList0: [],
        tabDatas0: [],
        tabData0ScrollTop: 0,
        searchDetail: { 
            imgUrl: '', 
            name: '', 
            type: '', 
            genre: '', 
            orgName: '', 
            sysUserName: '', 
            getDay: '',  
        },
    },

    effects: {
        *addEvluationRepor({ payload, callback }, { call, put }) {
            const res = yield call(assessmentApi.addEvluationRepor, payload)

            const { code } = res
            if(code === 1) {
                if(payload.type === 0) {
                    yield put({
                        type:  'insertTab0Data',
                        payload,
                    })
                } else {
                    yield put({
                        type:  'insertTab1Data',
                        payload,
                    })
                }
            }
            if(callback) {
                callback(res)
            }
        },
        *getDetailById({ payload }, { call, put }) {
            const res = yield call(assessmentApi.getDetailById, payload)
        },
        *getEvaluationResult({ payload, callback }, { call, put }) {
            const res = yield call(assessmentApi.getEvaluationResult, payload)
            
            if(callback) {
                callback(res)
            }
        },
        *getPageList({ payload, callback }, { call, put }) {
            const res = yield call(assessmentApi.getPageList, payload)
            const { code, data } = res
            
            if(code === 1) {
                if(payload.type === 0) {
                    yield put({
                        type:  payload.current === 1 ? 'setTab0DataList' : 'pushTab0DataList',
                        payload: data.list || []
                    })
                } else {
                    yield put({
                        type:  payload.current === 1 ? 'setTab1DataList' : 'pushTab1DataList',
                        payload: data.list || []
                    })
                }
                if(callback) {
                    let nextCurrent = payload.current
                    if(data && data.list && data.list.length > 0) {
                        nextCurrent = nextCurrent + 1
                    }
                    callback(nextCurrent)
                }
            }
        },
        *getReportList({ payload, callback }, { call, put }) {
            const res = yield call(assessmentApi.getReportList, payload)
            const { code, data } = res
            
            if(code === 1) {
                if(payload.type === 0) {
                    yield put({
                        type:  payload.current === 1 ? 'setTab0DataList' : 'pushTab0DataList',
                        payload: data.list || []
                    })
                } else {
                    yield put({
                        type:  payload.current === 1 ? 'setTab1DataList' : 'pushTab1DataList',
                        payload: data.list || []
                    })
                }
                if(callback) {
                    let nextCurrent = payload.current
                    if(data && data.list && data.list.length > 0) {
                        nextCurrent = nextCurrent + 1
                    }
                    callback(nextCurrent)
                }
            }
        },
    },

    reducers: {
        /** 组织 */
        insertTab0Data(state, { payload }) {
            const { tabList0 } = state
            const newData = { 
                ...payload,
                id: Number(new Date()),
                imgUrl: payload.imgFileList ? payload.imgFileList[0].path : '',
            }
            tabList0.unshift(newData)
            return {
                ...state,
                tabList0: tabList0,
                tabDatas0: payload,
                tabData0ScrollTop: 0,
            }
        },
        /** 组织 */
        setTab0DataList(state, { payload }) {
            return {
                ...state,
                tabList0: payload,
                tabDatas0: payload,
            }
        },
        /** 组织 */ 
        pushTab0DataList(state, { payload }) {
            const { tabList0 } = state
            if(payload.length > 0) {
                tabList0.push(payload)
            }
            return {
                ...state,
                tabList0: tabList0,
                tabDatas0: payload,
            }
        },
        setTabData0Scroll(state, { payload }) {
            return {
                ...state,
                tabData0ScrollTop: payload
            }
        },

        /** 个人 */
        insertTab1Data(state, { payload }) {
            const { tabList1 } = state
            const { checkedUsers } = payload

            checkedUsers.map(user => {
                const newData = {
                    ...payload,
                    id: Number(new Date()) + user.userId,
                    imgUrl: payload.imgFileList ? payload.imgFileList[0].path : '',
                    sysUserId: user.userId,
                    sysUserName: user.userName,
                }
                tabList1.unshift(newData)
            })
            return {
                ...state,
                tabList1: tabList1,
                tabDatas1: payload,
                tabData1ScrollTop: 0,
            }
        },
        /** 个人 */
        setTab1DataList(state, { payload }) {
            return {
                ...state,
                tabList1: payload,
                tabDatas1: payload,
            }
        },
        /** 个人 */
        pushTab1DataList(state, { payload }) {
            const { tabList1 } = state
            if(payload.length > 0) {
                tabList1.push(payload)
            }
            return {
                ...state,
                tabList1: tabList1,
                tabDatas1: payload,
            }
        },
        setTabData1Scroll(state, { payload }) {
            return {
                ...state,
                tabData1ScrollTop: payload
            }
        },
        getSearchDetail(state, { payload }) {
            const { tabList0, tabList1 } = state
            const searchDetail = [...tabList0, ...tabList1].find(item => item.id === payload)
            return {
                ...state,
                searchDetail
            }
        }
    }

}
