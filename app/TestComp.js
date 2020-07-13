import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost:3000";

function TestComp() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('QueueState', data => {
      setResponse(data);
    });

    return () => socket.disconnect();
  }, []);

  console.log(JSON.stringify(response));

  return (
    <p>
      test
    </p>
  )
}

export default TestComp;
