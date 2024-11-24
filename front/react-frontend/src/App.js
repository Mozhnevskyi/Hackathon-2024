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
