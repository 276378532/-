(function ($) {
    $.fn.Viewer = function (options) {

        //声明
        var $win = $(parent.window) || $(window),
            o = $(parent.document),
            //通过传入对象进行属性初始化
            settings = $.extend(true, {
                isPaging: true,//是否需要翻页
                imgTitleClass: "", // 选择图片的Class
                prevBgImg: "", // 上一张按钮图片
                nextBgImg: "", // 下一张按钮图片
                closeBgImg: "", // 关闭按钮图片
                imgSelector: "",
                //introduction: false, //是否需要显示标题背景
                IsBox: true //是否需要显示背景
            }, options),

            _this = this, //点击事件对象
            _allIndex = this.find("img[data-viewer]").length;//图片数量
        //_allIndex = this.children().length;


        //弹窗控制
        var setImage = {
            //控制dom
            IMG_BOX_BG: "imgViewerBoxBg", // 展示时的透明背景层
            IMG_BOX: "imgViewerBox", // 展示时的内容层
            IMG_ID_BG: "imgTitleContBg", // 图片标题透明背景层
            IMG_ID_TITLE: "imgTitleCont", // 图片标题标签ID
            IMG_ID_CLOSE: "imgClose", // 关闭标签ID
            IMG_ID: "fullResImg", // 图片标签ID
            IMG_PREV_ID: "imgPrev", // 上一张链接ID
            IMG_NEXT_ID: "imgNext", // 下一张链接ID
            IMG_BIG_ID: "imgBig", // 放大ID
            IMG_SMALL_ID: "imgSmall", // 缩小ID
            scrollNum: 1,   //缩放倍数
            IMG_VIEWER_LIST: "imgViewerList", //图片的父级标签ID
            sWidth: $win.width(), // 窗口宽度
            sHeight: $win.height(), // 窗口高度
            index: 0, // 当前图片索引
            imgUrlArry: [], // 存放图片地址数组
            imgTitleArry: [], // 存放图片标题数组
            ImgIndex: {},
            imgHtml: ('<div id="imgViewerBox" style="display:none;">' // 初始化弹层DOM
                + '<div id="imgViewerList">'
                + '<div>'
                + '<div id="imgClose">close</div>'
                + '<div id="imgBig"></div><div id="imgSmall"></div>'
                + '<img id="fullResImg" src="" style="display:none;" />'
                + '<div id="imgTitleCont"></div>'
                + '</div>'
                + '<div id="imgTitleContBg" style="display:none"></div>'
                + '</div>'
                + '<div id="imgPrev" style="display:none; background-color: rgba(0, 0, 0,.1); position:fixed; width:10%; height:100%; ;cursor:pointer;">prev</div>'
                + '<div id="imgNext" style="display:none; background-color: rgba(0, 0, 0,.1); position:fixed; width:10%; height:100%; ;cursor:pointer;">next</div>'
                + '</div>'
                + '<div id="imgViewerBoxBg" style="display:none;"></div>'),


            // 初始化入口
            init: function () {
                var that = this;
                _this.off("click.Viewer").on("click.Viewer", "img", function (e) {
                    if (!$(e.target).data('viewer') && !$(e.target).find().data('viewer')) { return false }
                    var e = e || event, $this = $(this),
                        $body = $(parent.document).find("body");
                    if (e && e.preventDefault) { e.preventDefault() } else { window.event.returnValue = false };
                    if ($(e.target).is("input")) { return false };
                    $body.append(setImage.imgHtml);
                    if (settings.introduction) { $('#' + setImage.IMG_ID_BG).show(); }
                    var imgMaxUrl = $this.attr("href") || $this.data("viewer") || $this.attr("src");
                    setImage.index = $this.index();
                    setImage.sWidth = $win.width();
                    setImage.sHeight = $win.height();
                    that.imgStyle();
                    that.getImgOrTitle();
                    setImage.index = setImage.ImgIndex[$this.data('imgindex')];
                    that.imgClick(imgMaxUrl);
                });
            },

            // 获取图片大图地址及图片标题，并提前缓存图片
            getImgOrTitle: function () {
                var that = this;
                var i = 0;
                setImage.imgUrlArry = [];
                setImage.imgTitleArry = [];
                setImage.ImgIndex = {};
                _this.find('img[data-viewer]').each(function (index) {
                    if (!!$(this).data('viewer')) {
                        var $this = $(this), imgMax = [],
                            _title_text = settings.imgTitleClass ? $this.parents("." + settings.imgSelector).find("." + settings.imgTitleClass).text() : $this.attr("title") ? $this.attr("title") : '',
                            _realIndex = index + 1,
                            title_num = '<p style="display: inline-block; margin-right:20px;"><span style="color: red; font-size: 28px; font-style: italic;">' + _realIndex + '</span><em style="font-style: italic; margin-left: 3px; margin-right: 1px; font-size: 24px;">|</em><span style="position:relative;top:5px;font-style: italic;">' + _allIndex + '</span></p>',
                            title_text = '<p style="display: inline-block;"><span>' + _title_text + '</span></p>',
                            _title = title_num + title_text,
                            imgurl = $this.data("viewer") || $this.attr("src");
                        $this.data('imgindex', index);
                        imgMax[index] = new Image();
                        imgMax[index].src = imgurl;
                        //imgMax[index].onload = function () { console.log("加载完成") }
                        setImage.ImgIndex[index] = i;
                        i++;
                        setImage.imgUrlArry.push(imgurl);
                        setImage.imgTitleArry.push(_title);
                    }
                })
            },

            // 获取图片高宽，返回包含高度的对象
            getImageSize: function (url) {
                var /*maxWidth = setImage.sWidth - 160,*/
                    maxWidth = setImage.sWidth * 0.8,
                    maxHeight = setImage.sHeight - 50;

                if (document.getElementById("" + this.IMG_ID)) {
                    if (document.getElementById("" + this.IMG_ID).naturalWidth) {
                        var boxWidth = document.getElementById("" + this.IMG_ID).naturalWidth;
                        var boxHeight = document.getElementById("" + this.IMG_ID).naturalHeight;
                        var w = document.getElementById("" + this.IMG_ID).naturalWidth;
                        var h = document.getElementById("" + this.IMG_ID).naturalHeight;
                    } else {
                        var boxWidth = document.getElementById("" + this.IMG_ID).width;
                        var boxHeight = document.getElementById("" + this.IMG_ID).height;
                        var w = document.getElementById("" + this.IMG_ID).width;
                        var h = document.getElementById("" + this.IMG_ID).height;
                    }
                } else {
                    return false;
                }
                if (h > maxHeight) {
                    w = (maxHeight * boxWidth / boxHeight);
                    h = maxHeight
                }
                if (w > maxWidth) {
                    w = maxWidth;
                    h = (maxWidth * boxHeight / boxWidth)
                }
                return { w: w, h: h }
            },

            // 获取图片顶部位置 返回顶部值
            getTop: function (h) {
                if (this.sHeight > h) {
                    return this.sHeight / 2 - h / 2;
                } else {
                    return 0;
                }
            },

            // 获取图片左边位置 返回左边值
            getLeft: function (w) {
                if (this.sWidth > w) {
                    return this.sWidth / 2 - w / 2;
                } else {
                    return 0;
                }
            },

            // 初始DOM样式 和注册事件
            imgStyle: function () {
                var that = this;
                var $imgBoxBg = o.find("#" + that.IMG_BOX_BG),
                    $imgBox = o.find("#" + that.IMG_BOX),
                    $imgIDClose = o.find("#" + that.IMG_ID_CLOSE),
                    $imgPrev = o.find("#" + that.IMG_PREV_ID),
                    $imgNext = o.find("#" + that.IMG_NEXT_ID),
                    $imgViwer = o.find("#" + that.IMG_VIEWER_LIST),
                    $imgBig = o.find("#" + that.IMG_BIG_ID),
                    $imgSmall = o.find("#" + that.IMG_SMALL_ID),
                    $imgID = o.find("#" + that.IMG_ID);

                var ScrollTop = parseInt($(window.parent.document).find('body').scrollTop()) <= 0 ? $(window.parent.document).find('html').scrollTop() : $(window.parent.document).find('body').scrollTop();
                ScrollTop = ScrollTop <= 20 ? 20 : ScrollTop;
                // 展示时的内容层样式
                $imgBox.css({
                    "position": "fixed",
                    "top": 0,
                    "left": 0,
                    "width": "100%",
                    "min-height": that.sHeight,
                    "z-index": 2019091
                }).fadeIn();

                // 展示时的透明背景层样式
                $imgBoxBg.css({
                    "position": "fixed",
                    "top": 0,
                    "left": 0,
                    "width": "100%",
                    "height": "100%",
                    // "min-height": that.sHeight,
                    "background": "#000",
                    "opacity": .6,
                    "z-index": 2019090,
                    "overflow": "hidden"
                })

                if (settings.isPaging) {
                    // 注册上一张事件
                    $imgPrev.off("click").on("click", function () {
                        that.prevClick();
                    });

                    // 注册下一张事件
                    $imgNext.off("click").on("click", function () {
                        that.nextClick();
                    });

                    // 註冊放大事件
                    $imgBig.off("click").on("click", function (e) {
                        that.scrollMouse(e, 1);
                    });

                    // 註冊缩小事件
                    $imgSmall.off("click").on("click", function (e) {
                        that.scrollMouse(e, -1);
                    });

                    // 註冊鼠标滚轮事件
                    $imgID.off("mousewheel").on("mousewheel", function (evet) {
                        that.scrollMouse(evet);
                    });

                    // 註冊图片拖拽事件
                    $imgID.off("mousedown").on("mousedown", function (evet) {
                        that.mouseDown(evet);
                    });
                }

                // 注册关闭事件
                $imgIDClose.off("click").on("click", function () {
                    that.closeClick();
                })
            },

            //设置样式
            imgResize: function (imgUrl) {
                var that = this;
                var $imgID = o.find("#" + that.IMG_ID),
                    $imgIDbg = o.find("#" + that.IMG_ID_BG),
                    $imgIDTitle = o.find("#" + that.IMG_ID_TITLE),
                    $imgPrev = o.find("#" + that.IMG_PREV_ID),
                    $imgNext = o.find("#" + that.IMG_NEXT_ID),
                    $imgBig = o.find("#" + that.IMG_BIG_ID),
                    $imgSmall = o.find("#" + that.IMG_SMALL_ID),
                    $imgIDClose = o.find("#" + that.IMG_ID_CLOSE),
                    $imgBoxBg = o.find("#" + that.IMG_BOX_BG);

                var imgSize = that.getImageSize(imgUrl);
                var top = imgSize.h >= that.sHeight ? 5 : that.getTop(imgSize.h);
                var tw = (that.sWidth - 100 <= imgSize.w) ? that.sWidth - 100 : imgSize.w;
                var left = tw >= that.sWidth ? 100 : that.getLeft(tw);

                // 设置图片样式
                $imgID.css({
                    "max-width": imgSize.w + "px",
                    "max-height": imgSize.h + "px",
                    "position": "absolute",
                    "top": top,
                    "left": left,
                    "cursor": "pointer",
                    "display": "block",
                    "margin": "auto"
                });

                //// 关闭层样式
                $imgIDClose.css({
                    "width": "30px",
                    "height": "30px",
                    "position": "fixed",
                    "top": 50,
                    "right": 50,
                    "z-index": 20160904,
                    "cursor": "pointer"
                }).html(settings.closeBgImg ? '<img width="30" src="https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112190957661.png" />' : 'close');


                // 图片标题透明背景层样式
                $imgIDbg.css({
                    "position": "absolute",
                    "background": "#000",
                    "opacity": .6,
                    "width": imgSize.w,
                    "height": "45px",
                    "z-index": 20160902,
                    "bottom": 0,
                    "left": 0
                });

                // 图片标题层样式
                $imgIDTitle.css({
                    "position": "absolute",
                    "color": "#fff",
                    "width": imgSize.w - 20,
                    //"height": "45px",
                    "text-align": "left",
                    "z-index": 20160903,
                    "padding": "10px",
                    "top": top + imgSize.h,
                    "left": left,
                    "overflow": "hidden",
                    "line-height": "22px",
                    "background": "rgba(0,0,0,0.5)",
                }).html(setImage.imgTitleArry[that.index] || "");
                var TitleHeight = $imgIDTitle.height();
                $imgIDTitle.css({ "top": top + imgSize.h - TitleHeight - 20 })

                // 上一张层样式
                $imgPrev.css({
                    "top": 0,
                    "left": 0
                }).html(settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (this.sHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + settings.prevBgImg + '"> </div>' : 'prev');

                // 下一张层样式
                $imgNext.css({
                    "top": 0,
                    "right": 0
                }).html(settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (this.sHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + settings.nextBgImg + '"> </div>' : 'prev');

                // 放大样式
                $imgBig.css({
                    "width": "30",
                    "position": "fixed",
                    "top": 100,
                    "right": 50,
                    "cursor": "pointer",
                    "z-index": 20160904,
                }).html(settings.prevBgImg ? '<img width="30" src="https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192601224.png" />' : 'big');

                // 缩小样式
                $imgSmall.css({
                    "width": "30",
                    "position": "fixed",
                    "top": 150,
                    "right": 50,
                    "cursor": "pointer",
                    "z-index": 20160904,
                }).html(settings.nextBgImg ? '<img width="30" src="https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192603317.png" />' : 'small');

                if (!settings.isPaging) {
                    $imgPrev.hide();
                    $imgNext.hide();
                } else {
                    $imgPrev.show();
                    $imgNext.show();
                }

                $imgID.fadeIn();

            },
            // 加载并显示图片
            imgClick: function (imgUrl) {
                var that = this;
                var $imgID = o.find("#" + that.IMG_ID);

                setTimeout(function () { $imgID.attr("src", imgUrl) }, 200);

                $imgID[0].onload = function () {  // 在IE下必须设置延迟（图片加载完在显示），否则读取图片信息会出错

                    that.imgResize(imgUrl);
                    if (settings.IsBox) { $('#' + setImage.IMG_BOX_BG).show(); }
                }
            },

            // 上一张
            prevClick: function () {
                if (setImage.index <= 0) {
                    setImage.index = _allIndex;
                }
                var $imgID = o.find("#" + this.IMG_ID);
                $imgID.hide();
                var imgUrl = setImage.imgUrlArry[--setImage.index];
                this.imgClick(imgUrl);
                setImage.scrollNum = 1;
                this.scrollMouse();
            },

            // 下一张
            nextClick: function () {
                if (setImage.index >= setImage.imgUrlArry.length - 1) {
                    setImage.index = -1;
                }
                var $imgID = o.find("#" + this.IMG_ID);
                $imgID.hide();
                var imgUrl = setImage.imgUrlArry[++setImage.index];
                this.imgClick(imgUrl);
                setImage.scrollNum = 1;
                this.scrollMouse();
            },

            // 关闭事件
            closeClick: function () {
                o.find("#" + this.IMG_BOX_BG).remove();
                o.find("#" + this.IMG_BOX).remove();
            },

            //滚轮缩放
            scrollMouse: function (event, _num) {
                var ev = event ? event : null;
                var IsIeNine = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9.") ? true : false;
                //var down = ev ? ev.deltaY : null; // 定义一个标志，当滚轮向下滚时，执行一些操作
                try { var down = _num ? _num : ev.deltaY; } catch (e) { }
                console.log(ev.wheelDelta)
                console.log(down)

                if (down > 0) {
                    if (setImage.scrollNum <= 2.6) {
                        setImage.scrollNum += 0.2;
                    } else {
                        try {
                            if (event && event.preventDefault) {
                                //阻止默认浏览器动作(W3C)
                                event.preventDefault();
                            } else {
                                //IE中阻止函数器默认动作的方式 
                                window.event.returnValue = false;
                            }
                        } catch (e) { }
                        //弹窗alter(已经是最大了)
                        // layer.msg("已经是最大了", { time: 1000, skin: "bgbg" })
                    }
                }
                if (down < 0) {
                    if (setImage.scrollNum > 0.3) {
                        setImage.scrollNum -= 0.2;
                    } else {
                        try {
                            if (event && event.preventDefault) {
                                //阻止默认浏览器动作(W3C)
                                event.preventDefault();
                            } else {
                                //IE中阻止函数器默认动作的方式 
                                window.event.returnValue = false;
                            }
                        } catch (e) { }
                        //alter(已经最小了)
                        //return layer.msg("已经是最小了", { time: 1000, skin: "bgbg" })
                    }
                }
                try {
                    if (event && event.preventDefault) {
                        //阻止默认浏览器动作(W3C)
                        event.preventDefault();
                    } else {
                        //IE中阻止函数器默认动作的方式 
                        window.event.returnValue = false;
                    }
                } catch (e) { }
                if (IsIeNine) {
                    document.querySelector("#fullResImg").style.msTransform = "scale(" + setImage.scrollNum + ")";  /*IE*/
                } else {
                    document.querySelector("#fullResImg").style.transform = "scale(" + setImage.scrollNum + ")";
                }

                return false;
            },

            //图片拖拽
            mouseDown: function (e) {
                var that = this;
                var $imgBOX = o.find("#" + that.IMG_BOX);

                var ele = $(e.target);
                var initX = e.clientX,
                    initY = e.clientY,
                    itemX = parseInt(ele.css('left')),
                    itemY = parseInt(ele.css('top'));

                $imgBOX.mousemove(function (e) {
                    //移动鼠标时改变元素位置
                    var curX = e.clientX,
                        curY = e.clientY;
                    ele.css({
                        left: itemX + (curX - initX) + 'px',
                        top: itemY + (curY - initY) + 'px'
                    });
                    if (e && e.preventDefault) {
                        //阻止默认浏览器动作(W3C)
                        e.preventDefault();
                        document.ondragstart = function () { return false; }
                    } else {
                        //IE中阻止函数器默认动作的方式 
                        window.event.returnValue = false;
                    }
                    //e.stopPropagation();
                    return false;
                });
                $imgBOX.mouseup(function () {
                    $imgBOX.off('mousemove');
                });
            },
        }

        // 遍历当前DOM
        //if (_this.find('img[data-viewer]').length > 0) {
        _this.each(function (index) {
            setImage.init();
        })
        //}
        // 改变窗口大小时，重新计算
        $win.resize(function () {
            setImage.sWidth = $win.width();
            setImage.sHeight = $win.height();
            o.find("#" + setImage.IMG_BOX_BG).css({
                "width": "100%",
                "height": "100%"
            })
            setImage.imgResize(o.find("#" + setImage.IMG_ID).data("viewer"));
        })
        return _this; // 返回当前DOM
    }
})(jQuery);
