import React, { Component } from 'react';

class VideoContainer extends Component {
  render() {
    return (
      <div
        style={{
          flexGrow: '1',
          position: 'relative',
          height: '40vh',
          width: '50%',
          alignItems: 'stretch',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <iframe
          src="http://173.66.227.178:8080/stream"
          style={{
            alignItems: 'stretch',
            justifyContent: 'center',
            flexGrow: '1'
          }}
        ></iframe>
      </div>
    );
  }
}

export default VideoContainer;
