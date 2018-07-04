define(["hbs!../templates/captureHighImage.html",
        "order/script/new_webcam/webcam",
], function(temp,webcams) {
    var curIndex;  //当前拍照次数
    var pics;   //照片数据数组
    var view = fish.View.extend({
        //el: false,
        template: temp,
        events : {
            "click .js-cameraHigh-snap" : "onSnap",
            "click .js-cancel" : "onClose",
            "click .js-upload" : "onUpload",
            "click .js-subshot" : "shotImg",
        },
        afterRender: function() {
            var that = this;
            that.$('.js-layout-main').splitter({
                 panes: [
                    { collapsible: false, size:"80%",scrollable: true},
                    { collapsible: false, size:"20%",scrollable: true}
                ]
            });
            that.$(".js-cameraHigh").css({overflowX:"hidden"});
            that.resize();
            that.initAttr();
            that.initCamera();
            that.initEvent();
        },
        //IE释放资源专线
        beforeRemove:function()
        {
            var that = this;
            var isIE = that.isIEBrowser();
            if(isIE)
            {
                 var object = Webcam.getMovie();
                 object._releaseCamera();
            }
        },
        //chorme,firefox释放资源
        cleanup:function(){
            var that = this;
            var isIE = that.isIEBrowser();
            if(!isIE)
            {
                webcams.reset();
            }

        },
        initAttr : function () {
        	 var that = this;
             that.isShot =false;
             pics = new Array(10);
             curIndex=0;
        },
        initCamera:function(){
            var that = this;

            // 入网测试，暂时不禁用按钮
            // that.$(".js-cameraHigh-snap").attr("disabled","true");

            webcams.init();
            var isIE = that.isIEBrowser();
            var height = that.$('.js-cameraHigh').height();
            var width = that.$('.js-cameraHigh').width();

            // webcams.attach( '.js-cameraHigh' );
              if(!isIE)
            {
                webcams.on("live",function(e){
                     that.$('.js-cameraList').combobox("enable");
                    that.$(".js-cameraHigh-snap").removeAttr("disabled");
                    that.$(".js-subshot").removeAttr("disabled");
                });
                webcams.getCameraList().then(function (resultList)
                {
                    that.webcamList = resultList;
                    var dataList =new Array();
                    that.webcamList.forEach(function(item,index)
                        {
                            var data ={};
                            data.name = item.label == '' ? 'user video'+index : item.label;
                            data.value =item.deviceId;
                            dataList.push(data);

                        });
                    that.$('.js-cameraList').combobox({
                        indexValue : 0,
                        placeholder:"请选择",
                        dataSource:dataList,
                        dataTextField: 'name',
                        dataValueField: 'value',
                        editable:false,
                        change:function(e)
                        {
                            that.$('.js-cameraList').combobox("disable");
                            that.$(".js-cameraHigh-snap").attr("disabled","true");
                            that.$(".js-subshot").attr("disabled","true");
                            webcams.reset();
                            webcams.set({
                                width: width,
                                highCapture: true,
                                image_format: 'jpeg',
                                jpeg_quality: 80,
                                // canvas_height:outerHeight
                            });
                            webcams.attach(".js-cameraHigh",this.value);
                           // that.$("video").height("795px");
                        }
                    });
                }).catch(function(err)
                {
                    that.$('.js-cameraList').combobox('enable');
                    fish.info(err);
                });
            }
            else
            {
              //ie浏览器 object可设置height
                webcams.set({
                    width: width,
                    height: height,
                    image_format: 'jpeg',
                    jpeg_quality: 80,
                });
                  webcams.on("live",function(e){
                    that.$(".js-cameraHigh-snap").removeAttr("disabled");
                    that.$(".js-subshot").removeAttr("disabled");
                });
                webcams.attach( '.js-cameraHigh' );
                Webcam.on( 'load', function() {
                    // var dom = document.getElementById("webcam_movie_obj");
                    that.webcamList = Webcam.getMovie()._getCameraList();
                    var dataList = new Array();
                    for(var i = 0; i<that.webcamList.length;i++)
                    {
                        var  data ={};
                        data.name = that.webcamList[i];
                        data.value = i;
                        dataList.push(data);
                    }
                    that.$('.js-cameraList').combobox({
                            indexValue : 0,
                            placeholder:"请选择",
                            dataSource:dataList,
                            dataTextField: 'name',
                            dataValueField: 'value',
                            change:function(e)
                            {
                                that.$(".js-cameraHigh-snap").attr("disabled","true");
                                that.$(".js-subshot").attr("disabled","true");
                                Webcam.getMovie()._setCamera(this.value);
                            }
                        });
               } );
            }
        },
        initEvent:function()
        {
            var that = this;
             that.$('.js-card-pic-list').delegate('button','click',function(e)
                {
                    var id = $(this).closest('.upload-photo-col').find('img').attr('id');

                    if(id!=undefined) {
                        var index  = id.split('img_id')[1];
                        pics[index]='';
                        $(this).closest('.upload-photo-col').find('img').remove();
                        curIndex--;
                    }

                });
             that.$('.js-card-pic-list').delegate('li','click',function(e)
                {
                    that.$('.js-card-pic-list').find('li').removeClass('activated');
                    $(this).addClass('activated');
                });
        },
        onSnap:function()
        {
            var that = this;
            /*
            webcams.snap( function(data_uri) {
                that.onGetImage(data_uri);
            });
            */
            // 入网测试
            that.onGetImage('order/template/default/business/img/rwcs-webcam-test.png');
        },


        onUpload : function() {
            var that = this;
            var parentParam = that.options;
            parentParam.imgStr = '';
            for(var i = 0;i < pics.length;i++){
                if(pics[i]==null||pics[i]==''||pics[i]=='undefined'){
                    continue;
                }
                parentParam.imgStr = pics[i]+"IMGSTR"+parentParam.imgStr;
            }
            var callBack = function(reply){
             var ret = reply;
             if(ret.resultCode=='0'){
                fish.success("补客户回执成功！",function(){
                    //this.popup.close();
                });
             }
             else{
                 fish.error(ret.resultMsg);
             }

            }
            fish.postsync('order/ReceiptController/updateCustReceipt.do', parentParam, callBack);
        },

        onGetImage:function(data_uri)
        {
          var that = this;
          // var i = $('#img_id0');
          if(data_uri)
          {
              if(curIndex>=10){
                  fish.error("拍照数量不能超过"+curIndex+"张!");
                  return;
              }
            // webcams.snap( function(data_uri) {
                that.loadImage(data_uri);
            // });
              curIndex++;
          }
          else
          {
              return false;
          }
          that.hide = false;
        },
        loadImage : function(value) {
            var that = this;
            // var isLoad = false;
            var height = that.$('.js-photo-box-example').height()-1;
            var width =  that.$('.js-photo-box-example').width();
            for(var i = 0;i<pics.length;i++){
                if(!pics[i]){
                    var img = new Image();
                    $(img).attr('id','img_id'+i);
                    $(img).attr("src",value);
                    $(img).width(width);
                    $(img).height(height);

                    /*
                    pics[i] = value.split("base64,")[1];
                    */
                    // 入网测试
                    pics[i] = value;

                    that.$(".js-card-pic-list").find('.upload-photo-cell:eq('+ i +')').append(img);
                    break;
                }
            }
        },
        isIEBrowser : function ()
        {
            var str = navigator.userAgent;
            var result = str.match(/\Trident?|MSIE?/g);
            if(result){
                //result.length =2 为IE11以下版本
                //result.length =1 位IE11
                return true;
            }
            else
            {
                return false;
            }
        },
        resize:function(){
            var that = this;
            that.$(".js-layout-main").css({
                'height' : $(window).outerHeight() - that.$(".js-layout-main").offset().top - 8
            });
            fish.resize(that.$(".js-layout-main"), true);
        },
        shotImg: function()
        {
            var that = this;
            var offTop= self.$('.js-layout-main').find(".panel-heading").outerHeight();
            var scrWidth = self.$('.js-cameraHigh')[0].offsetWidth - self.$('.js-cameraHigh')[0].clientWidth;;
            webcams.screenShot(offTop,0,function(){
                that.$(".js-cancelshot").show();
                that.$(".js-resetshot").show();
                that.$(".js-cameraHigh").off("canvasShot");
                that.$('.js-cameraHigh').on("canvasShot",function(e,url){
                if(url)
                        {
                           that.onGetImage(url);
                           that.$(".js-cancelshot").hide();
                           that.$(".js-resetshot").hide();
                        }
                        else
                        {
                            fish.info("截图失败,请重新截图");
                            that.$(".js-cancelshot").hide();
                            that.$(".js-resetshot").hide();
                        }
                });


            });

        },
        saveShot : function()
        {
            // var that = this;
            // webcams.saveShot(function(url)
            //     {
            //         if(url)
            //         {
            //            that.onGetImage(url);
            //            that.$(".js-saveshot").hide();
            //            that.$(".js-cancelshot").hide();
            //            that.$(".js-resetshot").hide();
            //         }
            //         else
            //         {
            //             fish.info("截图失败,请重新截图");
            //         }

            //     });
        },
    });
    return view;
});
