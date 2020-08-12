import React, { Component } from 'react';
// import VncDisplay from 'react-vnc-display';

class Vnc extends Component {
  render() {
    return (
      <div className="vnc-wrapper">
        {/*<VncDisplay
          url="ws://192.168.1.24:8080"
          wsProtocols={['udp', 'tcp']}
        />*/}
        <iframe src="http://69.204.209.84:6080/" width={1024} height={768}></iframe>
      </div>
    );
  }
}

export default Vnc;
