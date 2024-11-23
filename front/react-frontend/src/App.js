import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [upperCaseText, setUpperCaseText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpperCaseText(inputText.toUpperCase());

    try {
      const response = await axios.post('http://localhost:8000/process/', {
        text: inputText,
      });
      setProcessedText(response.data.processed_text.toUpperCase());
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Text Processor</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter text:
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your text here"
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        {upperCaseText && (
          <div className="result">
            <h2>Your Text in Uppercase:</h2>
            <p>{upperCaseText}</p>
          </div>
        )}

        {processedText && (
          <div className="result">
            <h2>Processed Text:</h2>
            <p>{processedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;