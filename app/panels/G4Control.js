import React, { Component } from 'react';
import axios from 'axios';
import './G4Control.css';

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
      <div className="g4-control">
        <input name="update" type="file" onChange={this.onFileChange} />
        <button onClick={this.onFileUpload}>
          Upload
        </button>
        {this.fileData()}
      </div>
    );
  }
}

export default G4Control;
