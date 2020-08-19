import React, { Component } from 'react';

class Vnc extends Component {
  render() {
    return (
      <div className="vnc-wrapper">
        <iframe src="http://73.173.201.209:6080/" width={1024} height={768}></iframe>
      </div>
    );
  }
}

export default Vnc;
