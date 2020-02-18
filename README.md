## 一个简单的点击图片放大 下一张 上一张 放大缩小的插件

#### 使用
```js
<div class='类名1'>
    <img src='1.png' title='信息' data-viewer='放大的1.png'>
</div>
     $("类名1").Viewer({ 
            imgTitleClass: "",
            imgSelector: "类名1",//图片
            prevBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152904076.png", //上一张标签图
            nextBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152928779.png",//下一张标签图
            closeBgImg: "https://www.fx110.com/images/icons/closer.gif"//关闭标签图
        })

        //就可以实现点击img放大img的图片并显示数量和title
```
效果如下:

![](https://imgs.wbp5.com/api/secrecymaster/html_up/2020/2/20200218232519630.png)
