import React from 'react';
import Webcam from '../../../webcam'
import './style.less'

class Camera extends React.Component {
    state = {
        webcamList: []
    }
    isIEBrowser = () => {
        var str = navigator.userAgent;
        var result = str.match(/\Trident?|MSIE?/g);
        if (result) {
            //result.length =2 为IE11以下版本
            //result.length =1 位IE11
            return true;
        }
        else {
            return false;
        }
    }
    componentDidMount() {
        let webcamList = this.state.webcamList;
        console.log(Webcam);
        let isIE = this.isIEBrowser();
        Webcam.init();
        Webcam.attach('js-cameraHigh');
        if (!isIE) {
            Webcam.on("live", function (e) {
                // $('.js-cameraList').combobox("enable");
                // $(".js-cameraHigh-snap").removeAttr("disabled");
                // $(".js-subshot").removeAttr("disabled");
            });
            Webcam.getCameraList().then(function (resultList) {
                webcamList = resultList;
                let dataList = new Array();
                webcamList.forEach(function (item, index) {
                    var data = {};
                    data.name = item.label == '' ? 'user video' + index : item.label;
                    data.value = item.deviceId;
                    dataList.push(data);
                    console.log(dataList);
                });
                // $('.js-cameraList').combobox({
                //     indexValue: 0,
                //     placeholder: "请选择",
                //     dataSource: dataList,
                //     dataTextField: 'name',
                //     dataValueField: 'value',
                //     editable: false,
                //     change: function (e) {
                //         that.$('.js-cameraList').combobox("disable");
                //         that.$(".js-cameraHigh-snap").attr("disabled", "true");
                //         that.$(".js-subshot").attr("disabled", "true");
                //         Webcam.reset();
                //         Webcam.set({
                //             width: width,
                //             highCapture: true,
                //             image_format: 'jpeg',
                //             jpeg_quality: 80,
                //             // canvas_height:outerHeight
                //         });
                //         webcams.attach(".js-cameraHigh", this.value);
                //         // that.$("video").height("795px");
                //     }
                // });
            }).catch(function (err) {
                // that.$('.js-cameraList').combobox('enable');
                // fish.info(err);
            });
        }
        else {
            //ie浏览器 object可设置height
            Webcam.set({
                width: width,
                height: height,
                image_format: 'jpeg',
                jpeg_quality: 80,
            });
            Webcam.on("live", function (e) {
                $(".js-cameraHigh-snap").removeAttr("disabled");
                $("js-subshot").removeAttr("disabled");
            });
            Webcam.attach('.js-cameraHigh');
            Webcam.on('load', function () {
                // var dom = document.getElementById("webcam_movie_obj");
                webcamList = Webcam.getMovie()._getCameraList();
                var dataList = new Array();
                for (var i = 0; i < webcamList.length; i++) {
                    var data = {};
                    data.name = webcamList[i];
                    data.value = i;
                    dataList.push(data);
                }
                $('.js-cameraList').combobox({
                    indexValue: 0,
                    placeholder: "请选择",
                    dataSource: dataList,
                    dataTextField: 'name',
                    dataValueField: 'value',
                    change: function (e) {
                        that.$(".js-cameraHigh-snap").attr("disabled", "true");
                        that.$(".js-subshot").attr("disabled", "true");
                        Webcam.getMovie()._setCamera(this.value);
                    }
                });
            });
        }
    }
    render() {
        return (
            <div className="camer-container" id="js-cameraHigh">

            </div>
        )
    }
}

export default Camera;