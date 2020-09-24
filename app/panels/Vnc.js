import React, { Component } from 'react';
import VideoContainer from '../VideoContainer';
import g2circuit from '../../public/img/g2Circuit2.jpg';

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
              <li>This assumes that you are familiar with the Waveforms application.</li>
              <li>Make sure that the power supplies are set to +/- 5V and enabled.</li>
              <li>On Waveforms, use the StaticIO to set the relay switches. Remember that relays are ACTIVE LOW, e.g. SW ON = DIO 0. The active switches are lit up on the video, make sure that the image reflects your switch desired settings.</li>
              <li>Here is a set of setting you can follow as QUICK START.  (You may need to adjust the time base and range of the scope.)</li>
              <li>ALL unspecified switches are OFF.</li>
            </ul>
            <ol>
              <li>Unity Gain <b>Inverting</b> amplifier:  SW1=ON, SW2 = ON, SW10=ON, (W1 RUNNING) Suggested input signal: W1 sine 1V @ 5kHz</li>
              <li>20dB Gain <b>Inverting</b> amplifier: SW1=ON, SW3 = ON, SW10=ON, (W1 RUNNING) Suggested input Signal: W1 sine 100mV @ 5kHz</li>
              <li>2X Gain <b>Non-inverting</b> amplifier:  SW2 = ON, SW10=ON, SW11=ON, SW12=ON (W2 RUNNING) Suggested input signal: W1 sine 1V @ 5kHz</li>
              <li>20dB Gain <b>Non-inverting</b> amplifier:  SW3 = ON, SW10=ON, SW11=ON, SW12=ON (W2 RUNNING) Suggested input signal: W1 sine 100mV @ 5kHz</li>
              <li>Unity Gain <b>Differential</b> amplifier: SW1=ON, SW2 = ON, SW10=ON, , SW12=ON (W1&W2, RUNNING), SW11=toggles Ch1 between W1 and W2 Suggested input signal: W1 sine 100mV @ 2kHz; W2: triangular 100mV @ 100Hz</li>
              <li>20dB <b>Differential</b> amplifier: SW1=ON, SW3 = ON, SW10=ON, , SW12=ON (W1&W2, RUNNING), SW11=toggles Ch1 between W1 and W2 Suggested input signal: W1 sine 50mV @ 2kHz; W2 triangular 100mV @ 100Hz</li>
              <li><b>Integrator</b> (f3dB=15kHz):  SW1=ON, SW2 = ON, SW7=ON, (W1 RUNNING) (May need to offset Scope) Suggested input signal: W1 square 100mV @ 1kHz </li>
              <li><b>Integrator</b> (f3dB=150kHz):  SW1=ON, SW3 = ON, SW7=ON, (W1 RUNNING) (May need to offset Scope)  Suggested input signal: W1 square 100mV @ 20kHz or 50kHz</li>
              <li><b>Integrator</b> with resistive feedback Impedance: SW1=ON, SW3 = ON, SW7=ON, SW10=ON (W1 RUNNING) (No offset on Scope needed) Suggested input signal: W1 square 100mV @ 20kHz or 50kHz</li>
              <li>20dB <b>Integrator</b> @ 15kHz: SW1=ON, SW4 = ON, SW7=ON, SW10=ON (W1 RUNNING) (No offset on Scope needed) Suggested input signal: W1 square 100mV @ 20kHz or 50kHz</li>
              <li><b>Differentiator</b>: SW1=ON, SW6 = ON, SW9=ON Suggested input signal: W1 triangular 1V @ 20kHz or 50kHz</li>
            </ol>
          </div>
          <div className="stream-schematic">
            <div className="vnc-wrapper">
              <VideoContainer url="http://129.2.94.100:6074/stream" />
              {window.location.protocol === 'https:' ? <p className="proto-warn">NOTE: for video streams to work you must switch from https to http in your address bar</p> : <></>}
            </div>
          </div>
          <div className="message-sequence">
            <h3 id="cs-title">CIRCUIT DIAGRAM</h3>
            <img src={g2circuit} style={{ width: '95%', borderRadius: 5, marginBottom: 20 }}></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Vnc;


