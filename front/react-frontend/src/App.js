import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { FaPaperPlane, FaRedo } from "react-icons/fa";

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
    setError("");

    if (!inputText.trim()) {
      setError("Input text cannot be empty.");
      return;
    }

    const userMessage = { sender: "user", text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:8000/process/", {
        text: userMessage.text,
      });

      const botMessageText = {
        sender: "bot",
        text: response.data.normalized_text || "No response from the server.",
      };

      const botMessageImage = {
        sender: "bot",
        image: "/graf.png", // Зображення з папки public
      };

      simulateTyping(botMessageText, botMessageImage);
    } catch (error) {
      console.error("Error processing data:", error);
      setError("Failed to process the text. Please try again.");
      setIsTyping(false);
    }
  };

  const simulateTyping = (botMessageText, botMessageImage) => {
    let index = 0;

    // Друк тексту
    const interval = setInterval(() => {
      if (index < botMessageText.text.length) {
        const currentMessage = {
          sender: "bot",
          text: botMessageText.text.slice(0, index + 1),
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (updatedMessages[updatedMessages.length - 1]?.sender === "bot") {
            updatedMessages[updatedMessages.length - 1] = currentMessage;
          } else {
            updatedMessages.push(currentMessage);
          }
          return updatedMessages;
        });
        index++;
      } else {
        clearInterval(interval); // Завершення друку тексту

        // Додаємо картинку як окреме повідомлення
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, botMessageImage]);
          setIsTyping(false);
        }, 500); // Затримка перед відображенням картинки
      }
    }, 50); // Швидкість друку тексту (50 мс на символ)
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
              {message.text && <p>{message.text}</p>}
              {message.image && (
                <img
                  src={message.image}
                  alt="Visualization"
                  style={{
                    width: "100%", // Зображення заповнює ширину контейнера
                    height: "auto", // Пропорції зберігаються
                    borderRadius: "12px",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
          ))}
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
