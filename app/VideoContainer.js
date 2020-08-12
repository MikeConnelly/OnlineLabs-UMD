import React, { Component } from 'react';

class VideoContainer extends Component {
  render() {
    return (
      <div
        className="video-container"
        style={{ position:'relative', height: '30%', width: '50%' }}
      >
        <iframe url="http://173.66.227.178:8080/stream"></iframe>
      </div>
    );
  }
}

export default VideoContainer;
