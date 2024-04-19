
//获取当前时间，格式YYYY-MM-DD HH:MM:SS
const GetNowTime = (time) => {
  var date = time,
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
    minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
    second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  month >= 1 && month <= 9 ? (month = "0" + month) : "";
  day >= 0 && day <= 9 ? (day = "0" + day) : "";
  // var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  var timer = year + "-" + month + "-" + day;
  return timer;
};

// 格式化电话号码
const GetPhone = (phone) => {
  let tel = phone.slice(0, 3) + "****" + phone.slice(7, 11);
  return tel;
};
//返回日期和周几数组
function weekDate() {
  var myDate = new Date();
  myDate.toLocaleDateString();
  var month = myDate.getMonth() + 1;
  var time =
    myDate.getFullYear() + "年" + month + "月" + myDate.getDate() + "日";
  var total = 1; // 个数
  var dayList = [];
  dayList.push({
    day: myDate.getDate(),
    month: myDate.getMonth() + total,
    week: toWeekDay(myDate.getDay()),
    year: myDate.getFullYear(),
  });
  for (var i = 0; i < 10; i++) {
    myDate.setDate(myDate.getDate() + total); // number 是最近几天 则会自动计算
    // 需求 月份-日 星期几
    dayList.push({
      day: myDate.getDate(),
      month: myDate.getMonth() + total,
      week: toWeekDay(myDate.getDay()),
      year: myDate.getFullYear(),
    });
  }
  console.log(dayList);
  // return dayList;
  let length = dayList.length;
  let arrOne = dayList[0];
  let arrLast = dayList[length - 1];
  let StartDate =
    arrOne.year.toString() + "-" + arrOne.month + "-" + arrOne.day;
  let EndDate =
    arrLast.year.toString() + "-" + arrLast.month + "-" + arrLast.day;
  return {
    dayList,
    StartDate,
    EndDate,
  };
}

function toWeekDay(weekDay) {
  // 传入数据 讲一周的某一天返回成中文状态下的字符
  switch (weekDay) {
    case 1:
      return "一";
      break;
    case 2:
      return "二";
      break;
    case 3:
      return "三";
      break;
    case 4:
      return "四";
      break;
    case 5:
      return "五";
      break;
    case 6:
      return "六";
      break;
    case 0:
      return "日";
      break;
    default:
      break;
  }
  return "传入未知参数";
}
// 数字输入框方法
/**
 * 输入框限制输入 只允许输入数字
 * value 数值 必填
 * max 最大值 选填
 * min 最小值 选填
 * length 小数点保留位数 选填
 * isBlur 失去焦点触发
 */
function limitInputNumber(value, max = null, min = null, length = null, isBlur = false, isMoney = false) {
  if (!value && value !== 0) {
    return min >= 0 ? min : null;
  }
  // 是否需要保留小数
  value = value.toString();
  if (!length) {
    if (max < 0 || min < 0) {
      value = value.replace(/[^\-\d]+/g, "");
    } else {
      value = value.replace(/[^0-9]/ig, "");
    }
  } else {
    // 保留数字和小数点
    if (max < 0 || min < 0) {
      value = value.replace(/[^\-\d^\.]+/g, "");
    } else {
      value = value.replace(/[^\d^\.]+/g, "");
    }
    if (value.indexOf(".") > 0) {
      value = value.slice(0, value.indexOf(".") + (length + 1));
    } else if (value.indexOf(".") === 0 && value.length === 1) {
      value = 0 + value;
    } else if (value.indexOf(".") === value.length - 1 && value.length != 0 && isBlur) {
      value = value.substring(0, value.length - 1);
    }
  }
  if (max || Number(max) === 0) {
    max = Number(max);
    const tempValue = Number(value);
    if (tempValue > max) {
      value = max;
    }
  }
  if (min || Number(min) === 0) {
    min = Number(min);
    const tempValue = Number(value);
    if (tempValue < min) {
      value = min;
    }
  }
  if (isMoney) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] === ".") {
        break;
      }
      if (value[i] == 0 && value[i + 1] !== "." && i == 0) {
        value = value.slice(i + 1, value.length - 1);
        i--;
      }
    }
  }
  if (isBlur) {
    return Number(value);
  } else {
    return value;
  }
}
function limitPhone(value) {
  let val = value;
  val = val.slice(0, 20);
  val = val.replace(/[^\d+-]/g, "");
  return val;
}

//公共图片上传
const uploadFile = (obj) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: obj.url, //请求地址
      filePath: obj.data, //图片路径
      name: 'file',
      header: {
        "token": uni.getStorageSync("token")
      },
      timeout: 2000,
      // formData: data,
      success: (res) => {
        if (JSON.parse(res.data).code == 200) {
          resolve(JSON.parse(res.data))

        }
      },
      fail: (error) => {
        console.log(error); //抛出异常
        if (error.errMsg == "uploadFile:fail timeout") {
          uni.showToast({
            title: '请求超时',
            mask: true,
            icon: 'error'
          })
        }
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })

}
function checkName(getUrl,page,title) {
  let exit = getUrl.split(".");
  exit = exit.pop();
  let noimgType = ["pptx", "ppt", "docx", "doc", "xlsx", "xls", "pdf"];
  if (noimgType.includes(exit)) {
    let url ='/pages/previewPage/webView?url='+getUrl
    if(page){
      url += `&page=${page}` 
    }
    if(title){
      url += `&title=${title}` 
    }
    console.log('跳转',url);
    uni.navigateTo({ url: url})
  }else if(['jpg','jpeg','png'].includes(exit)) {
    uni.previewImage({
      current:0,
      urls:[getUrl]
    })
  }
  else{
    uni.showToast({ title: '该文件类型不可预览', icon: 'none' })
  }
}
// 判断文件类型
function getFileType(fileName) {
  let suffix = ""; // 后缀获取
  let result = ""; // 获取类型结果
  if (fileName) {
    const flieArr = fileName.split("."); // 根据.分割数组
    suffix = flieArr[flieArr.length - 1]; // 取最后一个
  }
  if (!suffix) return false; // fileName无后缀返回false
  suffix = suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作
  // 匹配图片
  const imgList = ["png", "jpg", "jpeg", "bmp", "gif"]; // 图片格式
  result = imgList.find(item => item === suffix);
  if (result) return "image";
  // 匹配txt
  const txtList = ["txt"];
  result = txtList.find(item => item === suffix);
  if (result) return "txt";
  // 匹配excel
  const excelList = ["xls", "xlsx"];
  result = excelList.find(item => item === suffix);
  if (result) return "excel";
  // 匹配word
  const wordList = ["doc", "docx"];
  result = wordList.find(item => item === suffix);
  if (result) return "word";
  // 匹配pdf
  const pdfList = ["pdf"];
  result = pdfList.find(item => item === suffix);
  if (result) return "pdf";
  // 匹配ppt
  const pptList = ["ppt", "pptx"];
  result = pptList.find(item => item === suffix);
  if (result) return "ppt";
  // 匹配zip
  const zipList = ["rar", "zip", "7z"];
  result = zipList.find(item => item === suffix);
  if (result) return "zip";
  // 匹配视频
  const videoList = ["mp4", "m2v", "mkv", "rmvb", "wmv", "avi", "flv", "mov", "m4v"];
  result = videoList.find(item => item === suffix);
  if (result) return "video";
  // 匹配音频
  const radioList = ["mp3", "wav", "wmv"];
  result = radioList.find(item => item === suffix);
  if (result) return "radio";
  // 其他文件类型
  return "other";
}
module.exports = {
  GetNowTime,
  GetPhone,
  weekDate,
  toWeekDay,
  limitInputNumber,
  checkName,
  getFileType,
  limitPhone
};