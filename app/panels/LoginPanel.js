import React, { Component } from 'react';
import path from 'path';

class LoginPanel extends Component {
  
  handleLoginGoogle(event) {
    window.location.pathname = path.join(window.location.pathname, '/auth/google');
  }

  // hanldeLoginFacebook(event) {
  //   window.location.pathname = path.join(window.location.pathname, '/auth/facebook');
  // }
  // <button id="facebook-login" onClick={this.hanldeLoginFacebook}>Login with Facebook</button>

  render() {
    return (
      <div className="login-panel">
        <button id="google-login" onClick={this.handleLoginGoogle}>Login with Google</button>
      </div>
    );
  }
}

export default LoginPanel;
