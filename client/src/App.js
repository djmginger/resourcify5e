import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/testAPI")
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {message}
        </a>
      </header>
    </div>
  );
}

export default App;
