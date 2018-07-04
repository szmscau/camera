import React from 'react';
import Webcam from '../../../webcam'
import { Button, Dropdown, Menu, Toast } from 'antd';
import 'antd/dist/antd.css';
import './style.less';

class Camera extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        webcamList: [],
        imageList: []
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
    handleChangeCamera = (e) => {
        Webcam.reset();
        let height = document.getElementById('js-cameraHigh').offsetHeight;
        let width = document.getElementById('js-cameraHigh').offsetWidth;
        Webcam.set({
            width: width,
            height: height,
            image_format: 'jpeg',
            jpeg_quality: 80,
            // canvas_height:outerHeight
        });
        Webcam.attach("js-cameraHigh", e.key);
    }
    onSnap = () => {
        let self = this;
        Webcam.snap((url) => {
            if (url) {
                let list = self.state.imageList;
                list.push(url);
                self.setState({
                    imageList: list
                })
            } else {
                Toast.info('拍照失败!请重新拍照', 1, null, false)
            }
        })
    }
    shotImg = () => {
        let self = this;
        let offTop = $('#js-cameraHigh').offset().top;
        let offLeft = $('#js-cameraHigh').offset().left;
        // let scrWidth = self.$('.js-cameraHigh')[0].offsetWidth - self.$('.js-cameraHigh')[0].clientWidth;;
        Webcam.screenShot(offTop, offLeft, function () {
            // that.$(".js-cancelshot").show();
            // that.$(".js-resetshot").show();
            $("#js-cameraHigh").off("canvasShot");
            $('#js-cameraHigh').on("canvasShot", function (e, url) {
                if (url) {
                    let list = self.state.imageList;
                    list.push(url);
                    self.setState({
                        imageList: list
                    })
                    // console.log(url)
                    // that.onGetImage(url);
                    // that.$(".js-cancelshot").hide();
                    // that.$(".js-resetshot").hide();
                }
                else {
                    Toast.info('截图失败!请重新截图', 1, null, false)
                }
            });


        });

    }
    componentDidMount() {
        let isIE = this.isIEBrowser();
        let self = this;
        Webcam.init();
        Webcam.attach('js-cameraHigh');
        if (!isIE) {
            Webcam.on("live", function (e) {
                // $('.js-cameraList').combobox("enable");
                // $(".js-cameraHigh-snap").removeAttr("disabled");
                // $(".js-subshot").removeAttr("disabled");
            });
            let webcamList = this.state.webcamList;
            Webcam.getCameraList().then(function (resultList) {
                // webcamList = resultList;
                // let dataList = new Array();
                resultList.forEach(function (item, index) {
                    var data = {};
                    data.name = item.label == '' ? 'user video' + index : item.label;
                    data.value = item.deviceId;
                    webcamList.push(data);
                    self.setState({
                        webcamList
                    })

                });
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
    renderMenu() {
        const webcamList = this.state.webcamList;
        return (<Menu onClick={this.handleChangeCamera}>
            {
                webcamList.map((item) => (<Menu.Item key={item.value}>{item.name}</Menu.Item>))
            }
        </Menu>)

    }
    renderImage = () => {
        const imageList = this.state.imageList;
        return (
            imageList.length != 0 ? imageList.map((item, index) => {
                console.log(item);
                return (
                    <img src={item} key={index} />
                )
            }) : ''
        )
    }
    render() {
        const menu = this.renderMenu();
        return (
            <React.Fragment>
                <div className="camer-container">
                    <div id="js-cameraHigh">
                    </div>
                </div>
                <div className="btn-group">
                    <Button type="primary" ghost onClick={this.onSnap}>拍照</Button>
                    <Button type="dashed" onClick={this.shotImg} ghost>截图</Button>
                    {/* <Button type="dashed" ghost>取消截图</Button> */}
                    <Dropdown overlay={menu}>
                        <Button type="dashed" ghost style={{ marginLeft: 8 }}>
                            请选择摄像头
                        </Button>
                    </Dropdown>
                </div>
                <div className="image-group">
                    {this.renderImage()}
                </div>
            </React.Fragment>
        )
    }
}

export default Camera;