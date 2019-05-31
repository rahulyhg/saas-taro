import Taro from '@tarojs/taro'
import { uploadFile } from '../service/commonService';

interface IResult {
    code: number,
    data: Array<IImage>
}

interface IImage {
    id: '',
    path: ''
}

export default {
    namespace: 'common',
    state: {},

    effects: {
        *uploadMultiFile({ payload, callback }, { select, call, put }) {
            let result: IResult = {
                code: -1,
                data: []
            }
            if( payload.fileArr.length <= 0 ) {
                return result;
            }

            Taro.showLoading({
                mask: true,
                title: '正在上传...'
            });

            const resArr = yield payload.fileArr.map(file => {
                payload.filePath = file.url;
                return call(uploadFile, payload);
            });

            let arrResult = resArr.every(res => {
                if( res.statusCode == 200 ) {
                    result.data.push({
                        id: JSON.parse(res.data).path,
                        path: JSON.parse(res.data).path
                    });
                    return true;
                }
                return false;
            });

            Taro.hideLoading();

            if( arrResult ) {
                result.code = 1;
            } else {
                //上传出错提示
                Taro.showToast({
                    title: '上传失败，请稍后再试',
                    images: '../assets/images/toastError.png',
                    duration: 2000
                });
            }

            if(callback) {
                return callback(result);
            }
            return result;
        },

        *uploadSingleFile({ payload, callback }, { select, call, put }) {
            let result: IResult = {
                code: -1,
                data: []
            }
            if( !payload.filePath ) {
                return result;
            }

            Taro.showLoading({
                mask: true,
                title: '正在上传...'
            });

            const res = yield call(uploadFile, payload);

            Taro.hideLoading();

            if( res.statusCode == 200 ) {
                result.code = 1;
                result.data.path = JSON.parse(res.data).path;
                result.data.id = JSON.parse(res.data).id;
            } else {
                //上传出错提示
                Taro.showToast({
                    title: '上传失败，请稍后再试',
                    images: '../assets/images/toastError.png',
                    duration: 2000
                });
            }

            if(callback) {
                return callback(result);
            }
            return result;
        },
    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}