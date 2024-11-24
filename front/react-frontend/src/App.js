import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Анимация загрузки

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Сброс ошибок
    setProcessedText(""); // Очистка результата перед новым запросом

    if (!inputText.trim()) {
      setError("Input text cannot be empty."); // Проверка на пустое поле
      return;
    }

    setIsLoading(true); // Включаем анимацию загрузки

    try {
      const response = await axios.post("http://localhost:8000/process/", {
        text: inputText,
      });
      setProcessedText(response.data.normalized_text); // Используем нормализованный текст
    } catch (error) {
      console.error("Error processing data:", error);
      setError("Failed to process the text. Please try again.");
    } finally {
      setIsLoading(false); // Выключаем анимацию загрузки
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {/* Анимация загрузки */}
          {isLoading && (
            <div className="loading-animation">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}

          {/* Отображение ошибок */}
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          {/* Отображение результата */}
          {processedText && (
            <div className="message bot-message fade-in">
              <p>{processedText}</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your text here..."
            className="input-field"
          />
          <button
            type="submit"
            className={`send-button ${isLoading ? "disabled" : ""}`}
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;


