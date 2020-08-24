import React, { Component } from 'react';
import VideoContainer from '../VideoContainer';

class Vnc extends Component {
  render() {
    return (
      <div className="vnc-wrapper">
        <iframe src="http://129.2.94.100:6080/?password=enee205c" width={1024} height={768}></iframe>
        <VideoContainer url="http://129.2.94.100:6081/stream" />
      </div>
    );
  }
}

export default Vnc;
