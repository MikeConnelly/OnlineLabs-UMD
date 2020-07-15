import React, { Component } from 'react';
import path from 'path';

class LoginPanel extends Component {
  
  handleLogin(event) {
    window.location.pathname = path.join(window.location.pathname, '/auth/google');
  }

  render() {
    return (
      <div className="login-panel">
        <button onClick={this.handleLogin}>login</button>
      </div>
    );
  }
}

export default LoginPanel;
