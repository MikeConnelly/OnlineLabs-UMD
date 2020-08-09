import React, { Component } from 'react';
import VncDisplay from 'react-vnc-display';

class Vnc extends Component {
  render() {
    return (
      <div style={{width: 1024, height: 768 }}>
        <VncDisplay
          url="ws://192.168.1.24:8080"
          wsProtocols={['udp', 'tcp']}
        />
      </div>
    );
  }
}

export default Vnc;
