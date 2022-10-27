import React, { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';

import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:3001');


function App() {
  const [time, setTime] = useState(null);
  const [hasConnection, setConnection] = useState(false);


  useEffect(function didMount() {

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("time-msg", (data) => {
      setTime(new Date(data.time).toString());
      console.log('from web app')
    });


    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);


  const triggerMobile = () => {
    console.log('trigger mobile')
    socket.emit("webapp", { value: "sms is click" })
  }

  return (
    <div className="App">
      {time}

      <button onClick={triggerMobile}>click me</button>
    </div>
  );
}

export default App;
