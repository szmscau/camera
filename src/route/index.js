import React from 'react';
// import Header from '../components/header'
import Title from '../components/title';
import Footer from '../components/footer';
import Camera from '../components/camera';
import './style.less';


class Index extends React.Component {
  render() { // Every react component has a render method.
    return (
      <div className="resume-container">
        <Title />
        <div className="resume-bg">
          <div className="resume-content">
            {/* <Header /> */}
            <Camera />
          </div>
          <div className="br-block" />
        </div>
        <Footer index={false} text="resume" />
      </div>
    );
  }
}
export default Index;
