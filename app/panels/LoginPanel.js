import React, { Component } from 'react';
import path from 'path';

class LoginPanel extends Component {

  constructor(props) {
    super(props);
    this.handleLoginGoogle = this.handleLoginGoogle.bind(this);
  }
  
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
        <button id="google-login" onClick={this.handleLoginGoogle}>
          <span className="buttonText">Login with Google</span>
        </button>
      </div>
    );
  }
}

export default LoginPanel;
