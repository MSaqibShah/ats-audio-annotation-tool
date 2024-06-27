import { React, useEffect, useState } from "react";
import "./ChatApp.css";

import MessageAudio from "./MessageAudio";
import config from "../config";
import axios from "axios";

const Message = ({ type, content, timestamp, author, src }) => {
  const isSent = type === "sent";
  const messageClasses = `message ${isSent ? "sent" : "received"}`;
  const authorWrapperClasses = `author-wrapper ${isSent ? "sent" : "received"}`;
  const isAudio = src !== "";

  return (
    <div className={messageClasses}>
      {!isSent && (
        <div className="message-image">
          <img
            src={
              "https://i.pinimg.com/originals/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg"
            }
            alt={author}
            className="profile-pic"
          />
        </div>
      )}
      <div className="message-content">
        <div className={authorWrapperClasses}>
          <div className="author">{isSent ? "You" : author}</div>
        </div>
        <div className="bubble">
          <div className="background">
            <div className="content">
              {!isAudio ? content : <MessageAudio src={src} />}
            </div>
          </div>
          <div className="timestamp">{timestamp}</div>
        </div>
      </div>
      {isSent && (
        <div className="message-image">
          <img
            src={
              "https://i.pinimg.com/originals/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg"
            }
            alt={author}
            className="profile-pic"
          />
        </div>
      )}
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    onSend(inputValue);
    // Don't Allow Empty Inputs
    if (inputValue === "") {
      alert("Transcript cannot be empty");
      return;
    }

    setInputValue(""); // Clear the input field after sending
  };

  return (
    <div className="chat-input">
      <textarea
        type="text"
        placeholder="Type New Transcript Here"
        rows={5}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit} className="chat-input-btn">
        ➤
      </button>
    </div>
  );
};

const ChatApp = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;

  useEffect(() => {
    // This effect will run whenever `initialMessages` changes
    setMessages(initialMessages || []);
  }, [initialMessages]);

  const handleSendMessage = (newMessageContent) => {
    if (newMessageContent === "") {
      return;
    }
    // save the transcript using a patch request

    const data = axios.patch(
      `${BACKEND_URI}/api/audios/${messages[0].audio_id}`,
      { text: newMessageContent }
    );

    data
      .then((response) => {
        let newMessage = {
          id: messages ? messages.length + 1 : 3,
          author: "You",
          type: "sent",
          content: "Final Transcript: " + newMessageContent,
          src: "",
          timestamp: new Date().toTimeString().slice(0, 5),
        };

        const messageResponse = {
          id: messages ? messages.length + 1 : 4,
          author: "System",
          type: "recieved",
          content: "Transcript Updated Succesfully!",
          src: "",
          timestamp: new Date().toTimeString().slice(0, 5),
        };
        setMessages([...messages, newMessage, messageResponse]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="chat-app">
      <div className="messages">
        {messages && messages.map((msg) => <Message key={msg.id} {...msg} />)}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
