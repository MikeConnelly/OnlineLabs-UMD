import React, { Component } from 'react';
import path from 'path';

class LoginPanel extends Component {

  constructor(props) {
    super(props);
    this.handleLoginGoogle = this.handleLoginGoogle.bind(this);
  }
  
  handleLoginGoogle(_event) {
    window.location.pathname = path.join(window.location.pathname, '/auth/google');
  }

  handleLoginUMD(_event) {
    window.location.pathname = path.join(window.location.pathname, '/auth/umd');
  }

  render() {
    return (
      <div className="login-panel">
        <button id="google-login" onClick={this.handleLoginGoogle}>
          <span className="buttonText">Login with Google</span>
        </button>
        <button id="umd-login" onClick={this.handleLoginUMD}>
          <span className="buttonText">Login with UMD-CAS</span>
        </button>
      </div>
    );
  }
}

export default LoginPanel;
