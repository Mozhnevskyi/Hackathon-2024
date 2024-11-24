import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { FaPaperPlane, FaRedo } from "react-icons/fa";

// Компонент для поступового виведення тексту
const TypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Інтервал між символами (50 мс)

    return () => clearInterval(interval); // Очищення інтервалу
  }, [text]);

  return <p>{displayedText}</p>;
};

function App() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Сброс ошибок

    if (!inputText.trim()) {
      setError("Input text cannot be empty."); // Проверка на пустое поле
      return;
    }

    const userMessage = { sender: "user", text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText(""); // Очистка поля ввода
    setIsTyping(true); // Бот начинает "писать"

    try {
      const response = await axios.post("http://localhost:8000/process/", {
        text: userMessage.text,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.normalized_text || "No response from the server.",
      };

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false); // Завершаем "набор текста"
      }, 1500); // Задержка ответа
    } catch (error) {
      console.error("Error processing data:", error);
      setError("Failed to process the text. Please try again.");
      setIsTyping(false); // Останавливаем "набор текста"
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputText("");
    setError("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        <button className="reset-chat-button" onClick={handleClearChat}>
          <FaRedo />
        </button>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {message.sender === "bot" ? (
                <TypingText text={message.text} />
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message bot-message">
              <p>Bot is typing...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="input-field"
          />
          <button
            type="submit"
            className={`send-button ${isTyping ? "disabled" : ""}`}
            disabled={isTyping}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
