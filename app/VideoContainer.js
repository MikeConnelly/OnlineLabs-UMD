import React, { Component } from 'react';

class VideoContainer extends Component {
  render() {
    return (
      <div className="video-container">
        <iframe title= "Stream Testing: YouTube" width="100%" height="450px" 
          src="https://www.youtube.com/embed/live_stream?channel=UCLsZuPnAvZF6FrJqurU1jtQ" 
          frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen="Yes">
        </iframe>
      </div>
    );
  }
}

export default VideoContainer;
