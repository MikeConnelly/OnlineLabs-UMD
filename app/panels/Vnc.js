import React, { Component } from 'react';
import VideoContainer from '../VideoContainer';
import g2img from '../../public/img/Gizmo-2.png';

class Vnc extends Component {
  render() {
    return (
      <div className="page2">
        <div className="vnc-wrapper">
          <iframe src="http://129.2.94.100:6075/?password=enee205c" width={1024} height={768}></iframe>
        </div>

        <div className="control-panel-wrapper">
          {/* <div className="control-panel"> */}
          <div className="instructions">
            <h3 id="instruction-header">INSTRUCTIONS</h3>
            <ul>
              <li>Control wave function generator connected to AWG1 in circuit diagram with "Wavegen 1" tab</li>
              <li>View OSC1 and OSC2 probes with "Scope 1" tab</li>
              <li>Control analog outputs D1-D4 with "StaticIO" tab</li>
              <li>Control DC power supply DC1 with "Supplies" tab</li>
            </ul>
          </div>
          <div className="stream-schematic">
            <div className="vnc-wrapper">
              <VideoContainer url="http://129.2.94.100:6074/stream" />
              {window.location.protocol === 'https:' ? <p className="proto-warn">NOTE: for video streams to work you must switch from https to http in your address bar</p> : <></>}
            </div>
          </div>
          <div className="message-sequence">
            <h3 id="cs-title">CIRCUIT DIAGRAM</h3>
            <img src={g2img} style={{ width: '95%', borderRadius: 5 }}></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Vnc;


