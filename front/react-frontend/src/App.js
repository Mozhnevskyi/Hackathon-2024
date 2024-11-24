import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Імпортуємо файл з CSS стилями
import grafImage from "./graf.png"; // Імпортуємо зображення
import { FaPaperPlane, FaRedo } from 'react-icons/fa'; // Імпортуємо іконки для кнопок

function App() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Анімація "бот друкує"
  const [firstMessageSent, setFirstMessageSent] = useState(false); // Відслідковуємо, чи було надіслано перше повідомлення

  // Реф для останнього повідомлення
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputText.trim()) return; // Не надсилати порожній текст

    // Додати введений текст до списку повідомлень
    const userMessage = { sender: "user", text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Позначаємо, що перше повідомлення відправлено
    if (!firstMessageSent) {
      setFirstMessageSent(true);
    }

    // Почати відповідь від бота
    setIsTyping(true); // Імітація друкування
    const botMessage = { sender: "bot", text: "" }; // Текст бота додається поступово
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Поступове введення тексту
    const fullText = `${inputText}`;
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setMessages((prevMessages) => {
          // Клонування попереднього стану
          const updatedMessages = [...prevMessages];
          // Отримуємо останнє повідомлення бота
          const lastMessage = { ...updatedMessages[updatedMessages.length - 1] };

          if (lastMessage.sender === "bot" && !lastMessage.image) {
            lastMessage.text = fullText.slice(0, index + 1); // Поступове додавання тексту
            updatedMessages[updatedMessages.length - 1] = lastMessage; // Оновлюємо останнє повідомлення
          }

          return updatedMessages;
        });
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false); // Завершити друк тексту

        // Додати картинку через затримку
        const botImageMessage = {
          sender: "bot",
          image: grafImage,
        };
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, botImageMessage]);
        }, 500); // Затримка після тексту
      }
    }, 50); // Швидкість друкування

    setInputText(""); // Очищення поля вводу
  };

  const handleClearChat = () => {
    // Очищаємо всі стани
    setMessages([]);
    setInputText("");
    setFirstMessageSent(false);
  };

  // Використовуємо ефект для автоматичного скролінгу до кінця
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Слідкуємо за змінами в messages

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {/* Кнопка повтору */}
          <button
            className="reset-chat-button"
            onClick={handleClearChat}
          >
            <FaRedo /> {/* Іконка для кнопки повтору */}
          </button>

          {/* Показуємо текст, поки користувач не надіслав повідомлення */}
          {!firstMessageSent && (
            <div className="welcome-text">
              <p>Биняш - секс</p>
            </div>
          )}

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
                  alt="Bot response"
                  className="message-image"
                  onLoad={() => {
                    if (messagesEndRef.current) {
                      messagesEndRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                />
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message bot-message">
              <p>Bot is typing...</p>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Місце для автоматичного скролінгу */}
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
            className={`send-button ${isTyping ? "disabled" : ""}`} // Додаємо клас disabled
            disabled={isTyping} // Вимикаємо кнопку, коли бот пише
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
