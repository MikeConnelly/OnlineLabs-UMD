import React, { Component } from 'react';

class VideoContainer extends Component {
  render() {
    return (
      <div
        style={{
          flexGrow: '1',
          position: 'relative',
          height: '500px',
          width: '660px',
          alignItems: 'stretch',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        {window.location.protocol === 'https' ? (
          <span className="missing-video">To see the video feed please change https to http in your address bar.</span>
        ) : (
          <iframe
            src={this.props.url}
            style={{
              width: '640px',
              height: '480px',
              alignItems: 'stretch',
              justifyContent: 'center',
              flexGrow: '1'
            }}
          />
        )}
      </div>
    );
  }
}

export default VideoContainer;
