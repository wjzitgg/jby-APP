export function menuPerm(id){
    // 从本地缓存中异步获取menuArray的内容
    let date = uni.getStorageSync('user');
    let arr =date.permissions
    return arrIndexOf(arr, id);
}
// 判断是否存在该权限
function arrIndexOf(arr, id) {
    if(arr.indexOf(id) !== -1){
        return true;
    } else {
        return false;
    }
}
