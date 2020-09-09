import React, { Component } from 'react';
import VideoContainer from '../VideoContainer';

class Vnc extends Component {
  render() {
    return (
      <div className="vnc-wrapper">
        {window.location.protocol === 'https:' ? <p className="proto-warn">NOTE: for video streams to work you must switch from https to http in your address bar</p> : <></>}
        <iframe src="http://129.2.94.100:6075/?password=enee205c" width={1024} height={768}></iframe>
        <VideoContainer url="http://129.2.94.100:6074/stream" />
      </div>
    );
  }
}

export default Vnc;
