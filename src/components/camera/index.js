import React from 'react';
import Webcam from '../../../webcam'
import './style.less';

class Camera extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        webcamList: [],
        imageList: [],
        show: false
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
    handleChangeCamera = (event, item) => {
        this.setState({
            show: false
        })
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
        Webcam.attach("js-cameraHigh", item.value);
        event.preventDefault();
        event.stopPropagation();
    }
    onBtnClick = (e) => {
        this.setState({
            show: true
        })
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
            // Webcam.set({
            //     width: width,
            //     height: height,
            //     image_format: 'jpeg',
            //     jpeg_quality: 80,
            // });
            Webcam.on("live", function (e) {
            });
            Webcam.attach('#js-cameraHigh');
            Webcam.on('load', function () {
                // var dom = document.getElementById("webcam_movie_obj");
                webcamList = Webcam.getMovie()._getCameraList();
                console.log(webcamList);
                var dataList = new Array();
                for (var i = 0; i < webcamList.length; i++) {
                    var data = {};
                    data.name = webcamList[i];
                    data.value = i;
                    dataList.push(data);
                }
                this.setState({
                    webcamList: dataList
                })
            });
        }
    }
    renderMenu() {
        const webcamList = this.state.webcamList;
        return (
            webcamList.map((item) => (<li key={item.value} onClick={(e) => this.handleChangeCamera(e, item)}>{item.name}</li>))
        )
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
        const { show } = this.state;
        return (
            <React.Fragment>
                <div className="camer-container">
                    <div id="js-cameraHigh">
                    </div>
                </div>
                <div className="btn-group">
                    <button type="primary" onClick={this.onSnap}><span>拍照</span></button>
                    <button type="dashed" onClick={this.shotImg} ><span>截图</span></button>
                    {/* <Button type="dashed" ghost>取消截图</Button> */}
                    <button type="dashed" style={{ marginLeft: 8 }} onClick={this.onBtnClick} >
                        <span>请选择摄像头</span>
                        {
                            show === true ? <ul className="camera-list">
                                {this.renderMenu()}
                            </ul> : ""}
                    </button>

                </div>
                <div className="image-group">
                    {this.renderImage()}
                </div>
            </React.Fragment>
        )
    }
}

export default Camera;