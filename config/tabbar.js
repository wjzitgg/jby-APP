export default {
    "color": "#8B8B8B", // 表示tabBar item项中文字默认的颜色
    "selectedColor": "rgb(2, 167, 240)", // 表示tabBar item项中文字选中的颜色
    "borderStyle": "white", // 表示tabBar 上边框的颜色，目前只支持 black/white
    "backgroundColor": "#ffffff", // 表示 tabBar 的背景颜色
    "height":"90px",
    "navigationBarHidden":true,
    "list": [{
        "pagePath": "pages/index/index", // 表示第一tab项的页面路径
        "iconPath": "static/image/icon_home_u257.png", // 表示当前 tab 未选中时所显示的图标路径
        "selectedIconPath": "static/image/icon_home_u257_mouseOver.png", // 表示当前 tab 选中时所显示的图标文件路径
        "navigationBarHidden":true,
        "text": "首页" // 表示当前 tab 的文字
    }, 
    {
        "width": "106px",
        "height": "106px",
        "pagePath": "", // 表示第一tab项的页面路径
        "iconPath": "static/image/scanImg.png", // 表示当前 tab 未选中时所显示的图标路径
        "navigationBarHidden":true,
        "text": "扫一扫" // 表示当前 tab 的文字
    }, 
    {
        "pagePath": "pages/me/me",
        "iconPath": "static/image/icon_me_u261.png",
        "selectedIconPath": "static/image/icon_me_u261_mouseOver.png",
        "navigationBarHidden":true,
        "text": "我的"
    }],
    "midButton": {
        "width": "106px",
        "height": "106px",
        "text": "扫一扫",
        "iconPath": "static/image/scanImg.png",
        "iconWidth": "22px"
    }
}