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
        <iframe
          src={this.props.url}
          style={{
            width: '640px',
            borderRadius: '12px',
            alignItems: 'stretch',
            justifyContent: 'center',
            flexGrow: '1'
          }}
        />
      </div>
    );
  }
}

export default VideoContainer;
