define(["hbs!../templates/captureHighImage.html",
  "order/script/new_webcam/webcam",
], (temp, webcams) => {
  let curIndex; // 当前拍照次数
  let pics; // 照片数据数组
  const view = fish.View.extend({
    // el: false,
    template: temp,
    events: {
      "click .js-cameraHigh-snap": "onSnap",
      "click .js-cancel": "onClose",
      "click .js-upload": "onUpload",
      "click .js-subshot": "shotImg",
    },
    afterRender() {
      const that = this;
      that.$(".js-layout-main").splitter({
        panes: [
          { collapsible: false, size: "80%", scrollable: true },
          { collapsible: false, size: "20%", scrollable: true },
        ],
      });
      that.$(".js-cameraHigh").css({ overflowX: "hidden" });
      that.resize();
      that.initAttr();
      that.initCamera();
      that.initEvent();
    },
    // IE释放资源专线
    beforeRemove() {
      const that = this;
      const isIE = that.isIEBrowser();
      if (isIE) {
        const object = Webcam.getMovie();
        object._releaseCamera();
      }
    },
    // chorme,firefox释放资源
    cleanup() {
      const that = this;
      const isIE = that.isIEBrowser();
      if (!isIE) {
        webcams.reset();
      }
    },
    initAttr() {
        	 const that = this;
      that.isShot = false;
      pics = new Array(10);
      curIndex = 0;
    },
    initCamera() {
      const that = this;

      // 入网测试，暂时不禁用按钮
      // that.$(".js-cameraHigh-snap").attr("disabled","true");

      webcams.init();
      const isIE = that.isIEBrowser();
      const height = that.$(".js-cameraHigh").height();
      const width = that.$(".js-cameraHigh").width();

      // webcams.attach( '.js-cameraHigh' );
      if (!isIE) {
        webcams.on("live", (e) => {
          that.$(".js-cameraList").combobox("enable");
          that.$(".js-cameraHigh-snap").removeAttr("disabled");
          that.$(".js-subshot").removeAttr("disabled");
        });
        webcams.getCameraList().then((resultList) => {
          that.webcamList = resultList;
          const dataList = new Array();
          that.webcamList.forEach((item, index) => {
            const data = {};
            data.name = item.label == "" ? `user video${index}` : item.label;
            data.value = item.deviceId;
            dataList.push(data);
          });
          that.$(".js-cameraList").combobox({
            indexValue: 0,
            placeholder: "请选择",
            dataSource: dataList,
            dataTextField: "name",
            dataValueField: "value",
            editable: false,
            change(e) {
              that.$(".js-cameraList").combobox("disable");
              that.$(".js-cameraHigh-snap").attr("disabled", "true");
              that.$(".js-subshot").attr("disabled", "true");
              webcams.reset();
              webcams.set({
                width,
                highCapture: true,
                image_format: "jpeg",
                jpeg_quality: 80,
                // canvas_height:outerHeight
              });
              webcams.attach(".js-cameraHigh", this.value);
              // that.$("video").height("795px");
            },
          });
        }).catch((err) => {
          that.$(".js-cameraList").combobox("enable");
          fish.info(err);
        });
      } else {
        // ie浏览器 object可设置height
        webcams.set({
          width,
          height,
          image_format: "jpeg",
          jpeg_quality: 80,
        });
        webcams.on("live", (e) => {
          that.$(".js-cameraHigh-snap").removeAttr("disabled");
          that.$(".js-subshot").removeAttr("disabled");
        });
        webcams.attach(".js-cameraHigh");
        Webcam.on("load", () => {
          // var dom = document.getElementById("webcam_movie_obj");
          that.webcamList = Webcam.getMovie()._getCameraList();
          const dataList = new Array();
          for (let i = 0; i < that.webcamList.length; i++) {
            const data = {};
            data.name = that.webcamList[i];
            data.value = i;
            dataList.push(data);
          }
          that.$(".js-cameraList").combobox({
            indexValue: 0,
            placeholder: "请选择",
            dataSource: dataList,
            dataTextField: "name",
            dataValueField: "value",
            change(e) {
              that.$(".js-cameraHigh-snap").attr("disabled", "true");
              that.$(".js-subshot").attr("disabled", "true");
              Webcam.getMovie()._setCamera(this.value);
            },
          });
        });
      }
    },
    initEvent() {
      const that = this;
      that.$(".js-card-pic-list").delegate("button", "click", function (e) {
        const id = $(this).closest(".upload-photo-col").find("img").attr("id");

        if (id != undefined) {
          const index = id.split("img_id")[1];
          pics[index] = "";
          $(this).closest(".upload-photo-col").find("img").remove();
          curIndex--;
        }
      });
      that.$(".js-card-pic-list").delegate("li", "click", function (e) {
        that.$(".js-card-pic-list").find("li").removeClass("activated");
        $(this).addClass("activated");
      });
    },
    onSnap() {
      const that = this;
      /*
            webcams.snap( function(data_uri) {
                that.onGetImage(data_uri);
            });
            */
      // 入网测试
      that.onGetImage("order/template/default/business/img/rwcs-webcam-test.png");
    },


    onUpload() {
      const that = this;
      const parentParam = that.options;
      parentParam.imgStr = "";
      for (let i = 0; i < pics.length; i++) {
        if (pics[i] == null || pics[i] == "" || pics[i] == "undefined") {
          continue;
        }
        parentParam.imgStr = `${pics[i]}IMGSTR${parentParam.imgStr}`;
      }
      const callBack = function (reply) {
        const ret = reply;
        if (ret.resultCode == "0") {
          fish.success("补客户回执成功！", () => {
            // this.popup.close();
          });
        } else {
          fish.error(ret.resultMsg);
        }
      };
      fish.postsync("order/ReceiptController/updateCustReceipt.do", parentParam, callBack);
    },

    onGetImage(data_uri) {
      const that = this;
      // var i = $('#img_id0');
      if (data_uri) {
        if (curIndex >= 10) {
          fish.error(`拍照数量不能超过${curIndex}张!`);
          return;
        }
        // webcams.snap( function(data_uri) {
        that.loadImage(data_uri);
        // });
        curIndex++;
      } else {
        return false;
      }
      that.hide = false;
    },
    loadImage(value) {
      const that = this;
      // var isLoad = false;
      const height = that.$(".js-photo-box-example").height() - 1;
      const width = that.$(".js-photo-box-example").width();
      for (let i = 0; i < pics.length; i++) {
        if (!pics[i]) {
          const img = new Image();
          $(img).attr("id", `img_id${i}`);
          $(img).attr("src", value);
          $(img).width(width);
          $(img).height(height);

          /*
                    pics[i] = value.split("base64,")[1];
                    */
          // 入网测试
          pics[i] = value;

          that.$(".js-card-pic-list").find(`.upload-photo-cell:eq(${i})`).append(img);
          break;
        }
      }
    },
    isIEBrowser() {
      const str = navigator.userAgent;
      const result = str.match(/\Trident?|MSIE?/g);
      if (result) {
        // result.length =2 为IE11以下版本
        // result.length =1 位IE11
        return true;
      }

      return false;
    },
    resize() {
      const that = this;
      that.$(".js-layout-main").css({
        height: $(window).outerHeight() - that.$(".js-layout-main").offset().top - 8,
      });
      fish.resize(that.$(".js-layout-main"), true);
    },
    shotImg() {
      const that = this;
      const offTop = self.$(".js-layout-main").find(".panel-heading").outerHeight();
      const scrWidth = self.$(".js-cameraHigh")[0].offsetWidth - self.$(".js-cameraHigh")[0].clientWidth;
      webcams.screenShot(offTop, 0, () => {
        that.$(".js-cancelshot").show();
        that.$(".js-resetshot").show();
        that.$(".js-cameraHigh").off("canvasShot");
        that.$(".js-cameraHigh").on("canvasShot", (e, url) => {
          if (url) {
            that.onGetImage(url);
            that.$(".js-cancelshot").hide();
            that.$(".js-resetshot").hide();
          } else {
            fish.info("截图失败,请重新截图");
            that.$(".js-cancelshot").hide();
            that.$(".js-resetshot").hide();
          }
        });
      });
    },
    saveShot() {
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
