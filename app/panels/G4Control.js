import React, { Component } from 'react';
import axios from 'axios';
import './G4Control.css';
import g4s from '../../public/img/G4_schematic.png';
import VideoContainer from '../VideoContainer';

export class G4Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.fileData = this.fileData.bind(this);
  }

  onFileChange(event) {
    this.setState({ selectedFile: event.target.files[0] });
  }

  onFileUpload() {
    const formData = new FormData();
    formData.append(
      "update",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    axios.post('api/g4/upload', formData);
  }

  fileData() {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h4>No file selected</h4>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="page3">
        <div className="control-panel-wrapper">
          {/* <div className="control-panel"> */}
          <div className="instructions">
            <h3 id="instruction-header">INSTRUCTIONS</h3>
            <ol>
              <li>Download template arduino (.ino) file from: <a href="https://drive.google.com/drive/folders/1OUMTOmIDhHvlD65Tx0hKRym4bgZU2h9A">here</a></li>
              <li>Edit arduino file with new Code. Start setup code at “START SETUP CODE HERE” andloop code at “START LOOP CODE HERE”</li>
              <li>Check that the edited code compiles and saves. Then go to Sketch > Export CompiledBinary to generate a .bin file of your program.</li>
              <li>To find the folder where the binary (.bin) file is saved, go to Sketch > Show SketchFolder.</li>
              <li>Once in the Gizmo-4 website, upload the binary file to the website and press the upload button.</li>
              <li>Please wait 2-5 minutes for the ota firmware update to properly take place.</li>
            </ol>
          </div>
          <div className="g4-middle-column">
            {window.location.protocol === 'https:' ? <p className="proto-warn">NOTE: for video streams to work you must switch from https to http in your address bar</p> : <></>}
            <VideoContainer url="http://129.2.94.100:6081/stream" />
            <div className="g4-form">
              <h3 id="cs-title">UPLOAD</h3>
              <input name="update" type="file" onChange={this.onFileChange} />
              <input id="run-button-gizmo4" type="button" onClick={this.onFileUpload} value="Upload" />
              {this.fileData()}
            </div>
          </div>
          <div className="message-sequence">
            <h3 id="cs-title">SCHEMATIC</h3>
            <img src={g4s} style={{ width: '95%', borderRadius: 5  }}></img>
          </div>
        </div>
      </div>
    );
  }
}

export default G4Control;
