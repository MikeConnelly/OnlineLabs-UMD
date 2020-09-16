import React, { Component } from 'react';
import axios from 'axios';
import './G4Control.css';
import g4s from '../../public/img/G4_schematic.png';

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
            <ul>
              <li>Download template arduino (.ino) file from <a href="https://drive.google.com/file/d/1pDUesa7DChgK8R2RWaZKyouuP54PQOuN/view?usp=sharing">this link</a></li>
              <li>Upload the Binary File and view changes in the live feed</li>
              <li>Customize the template arduino (.ino) file and upload the customized Binary file</li>

            </ul>
          </div>
          <div className="message-sequence">
            <h3 id="cs-title">SCHEMATIC</h3>
            <img src={g4s} style={{ width: '95%' }}></img>
          </div>
          <div className="message-sequence">
            <h3 id="cs-title">UPLOAD</h3>

            <input name="update" type="file" onChange={this.onFileChange} />
            <input id="run-button-gizmo4"
              type="button" onClick={this.onFileUpload} value="Upload"></input>
            {this.fileData()}
          </div>
        </div>
      </div>

    );
  }
}

export default G4Control;
