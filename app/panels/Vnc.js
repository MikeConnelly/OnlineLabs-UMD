import React, { Component } from 'react';
import VncDisplay from 'react-vnc-display';

class Vnc extends Component {
  render() {
    return (
      <div>
        {/*<VncDisplay
          url="ws://192.168.1.24:8080"
          wsProtocols={['udp', 'tcp']}
        />*/}
        <iframe src="http://69.204.209.84:6080/" height={768} width={1024} ></iframe>
      </div>
    );
  }
}

export default Vnc;
