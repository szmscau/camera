import React from "react";
import "./style.less";

class Footer extends React.Component {
  clickHandle() {

  }

  render() {
    const { index, text, position } = this.props;
    console.log(position);
    return (
      <div className="footer" style={{ position }}>
        {index ? <div className="clickMe" onClick={this.clickHandle}><a href="https://github.com/szmscau">@Me.</a></div>
          : (
            <div>Build <div className="text-blue"> {text} </div> by <div className="text-blue"> Lighing </div>
            </div>
          )}
      </div>
    );
  }
}

export default Footer;
