
export const repeat = (str = '0', times) => (new Array(times + 1)).join(str);
// 时间前面 +0 
export const pad = (num, maxLength = 2) => repeat('0', maxLength - num.toString().length) + num;
/** 时间格式的转换 */
export const formatTime = time => `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}`
// eslint-disable-next-line
export let globalData: any = {
  commonDateFormatStr: 'yyyy-MM-dd HH:mm',
  commonShortDateFormatStr: 'yyyy-MM-dd',
  customDateFormatStr: 'yyyy.MM.dd',
  toastErrorImg: 'images/toastError.png'
} // 全局公共变量

/**
 * 校验手机号是否正确
 * @param phone 手机号
 */

export const verifyPhone = (phone) => {
  const reg = /^1[34578][0-9]{9}$/
  const _phone = phone.toString().trim()
  let toastStr = _phone === '' ? '手机号不能为空~' : !reg.test(_phone) && '请输入正确手机号~'
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _phone
  }
}

export const verifyStr = (str, text) => {
  const _str = str.toString().trim()
  const toastStr = _str.length ? false : `请填写${text}～`
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _str
  }
}

// 截取字符串
export const sliceStr = (str, sliceLen) => {
  if (!str) { return '' }
  let realLength = 0
  const len = str.length
  let charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
    if (realLength > sliceLen) {
      return `${str.slice(0, i)}...`
    }
  }

  return str
}


/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
  var buf
  if (jsonObj instanceof Array) {
    buf = []
    var i = jsonObj.length
    while (i--) {
      buf[i] = objClone(jsonObj[i])
    }
    return buf
  } else if (jsonObj instanceof Object) {
    buf = {}
    for (var k in jsonObj) {
      buf[k] = objClone(jsonObj[k])
    }
    return buf
  } else {
    return jsonObj
  }
}

/**
 * 防抖
 * @param func 函数
 * @param wait 时间
 */
export function debounce(func, wait) {      
  var timeout;      
  return function () {          
    var context = this;          
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, wait);
  }
}

/**
 * 时间格式化
 * @param time 时间 2019-10-01 00:00:00
 * @param format yyyy-MM-dd HH:mm:ss
 */
export function formatDate(time: string, format) {
  if (!time) {
    return ''
  }
  const t = typeof time == 'string' ? new Date(time.replace(/-/g, '/')) : new Date(time);
  const tf = function (i) { return (i < 10 ? '0' : '') + i };
  const newTime = format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
  return newTime;

}


/**
 * 经纬度距离公式
 */
export function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS 
  s = Math.round(s * 10000) / 10000;
  return s; // return的距离单位为km
}

/**
* 计算时间戳之间的差值
*
* @param startTimeStamp 开始时间戳（必填）
* @param endTimeStamp 结束时间戳 （非必填）
*/

export function calculateDiffTime(startTimeStamp, endTimeStamp) {
  var nowDate = new Date();    //结束时间
  var dIsDate = (endTimeStamp ? endTimeStamp : nowDate.getTime()) - startTimeStamp;   //时间差的毫秒数
  //------------------------------
  //计算出相差天数
  var days = Math.floor(dIsDate / (24 * 3600 * 1000))

  //计算出小时数
  var leave1 = dIsDate % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  alert(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
  const _seconds = seconds + minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60;
  return _seconds; // 秒数
}

export function dateFormat(e, t) {
  var n = typeof e == 'string' ? new Date(e.replace(/-/g, '/')) : new Date(e);
  var r = {
    "M+": n.getMonth() + 1,
    "d+": n.getDate(),
    "h+": n.getHours(),
    "m+": n.getMinutes(),
    "s+": n.getSeconds(),
    "q+": Math.floor((n.getMonth() + 3) / 3),
    S: n.getMilliseconds()
  };
  /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
  for (var o in r) new RegExp("(" + o + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? r[o] : ("00" + r[o]).substr(("" + r[o]).length)));
  return t;
}

export function getBirthdayFromIdCard(idCard) {  
  var birthday = "";  
  if(idCard != null && idCard != ""){  
      if(idCard.length == 15){  
          birthday = "19"+idCard.substr(6,6);  
      } else if(idCard.length == 18){  
          birthday = idCard.substr(6,8);  
      }  
    
      birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
  }  
    
  return birthday;  
}

