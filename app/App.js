import React, { useState } from 'react';
import path from 'path';
import TestComp from './TestComp';

function handleLogin() {
  window.location.pathname = path.join(window.location.pathname, '/auth/google');
}

function App() {
  const [loadClient, setLoadClient] = useState(true);
  return (
    <div>
      <button onClick={event => handleLogin()}>login</button>
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        stop client
      </button>
      {loadClient ? <TestComp /> : null}
    </div>
  );
}

export default App;
