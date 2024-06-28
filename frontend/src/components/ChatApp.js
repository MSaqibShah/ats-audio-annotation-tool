import { React, useEffect, useState } from "react";
import "./ChatApp.css";

import MessageAudio from "./MessageAudio";
import config from "../config";
import axios from "axios";

const Message = ({ type, content, timestamp, author, src }) => {
  const isSent = type === "sent";
  const messageClasses = `message ${isSent ? "sent" : "received"}`;
  const authorWrapperClasses = `author-wrapper ${isSent ? "sent" : "received"}`;
  const timestampClasses = `timestamp ${
    isSent ? "timestamp-sent" : "timestamp-received"
  }`;
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
          <div className="author">{author}</div>
        </div>
        <div className="bubble">
          <div className="background">
            <div className="content">
              {!isAudio ? content : <MessageAudio src={src} type={type} />}
            </div>
          </div>
          <div className={timestampClasses}>{timestamp}</div>
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

const ChatInput = ({ onSend, isDisabled }) => {
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
        disabled={isDisabled}
        type="text"
        placeholder="Type New Transcript Here"
        rows={5}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        disabled={isDisabled}
        onClick={handleSubmit}
        className="chat-input-btn"
      >
        ➤
      </button>
    </div>
  );
};

const ChatApp = ({
  initialMessages,
  audioIndex,
  messageSetter,
  isDisabled,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;

  useEffect(() => {
    // This effect will run whenever `initialMessages` changes
    setMessages(initialMessages || []);
  }, [initialMessages]);
  function findObjectById(objectsArray, key, value) {
    const index = objectsArray.findIndex((obj) => obj[key] === value);
    if (index !== -1) {
      return { object: objectsArray[index], index: index };
    } else {
      return null; // or handle the case where the object is not found
    }
  }
  const handleSendMessage = async (newMessageContent) => {
    let audioToChangeObj = findObjectById(
      initialMessages,
      "id",
      `t_${audioIndex}`
    );

    let audioToChange = audioToChangeObj.object;
    let dbId = audioToChange.audio_id;
    let index = audioToChangeObj.index;
    if (newMessageContent === "") {
      return;
    }
    // save the transcript using a patch request

    let response = await axios.patch(
      `${BACKEND_URI}/api/audios/${audioToChange.audio_id}`,
      { text: newMessageContent }
    );

    if (response.status !== 200) {
      alert("Error Updating Transcript");
      return;
    }
    // change content of the message in the frontend
    audioToChange["content"] = `Transcription: ${newMessageContent}`;

    let updatedMessages = [...messages];
    updatedMessages[index] = audioToChange;

    // find the audio in conversations in local storage and update it
    let conversation = JSON.parse(localStorage.getItem("conversation"));

    let localAudioObject = findObjectById(conversation.audios, "_id", dbId);
    let localAudio = localAudioObject.object;
    let localIndex = localAudioObject.index;

    localAudio.text = newMessageContent;

    conversation.audios[localIndex] = localAudio;

    localStorage.setItem("conversation", JSON.stringify(conversation));
    setMessages(updatedMessages);
    messageSetter(updatedMessages);
  };

  return (
    <div className="chat-app">
      <div className="messages">
        {messages && messages.map((msg) => <Message key={msg.id} {...msg} />)}
      </div>
      <ChatInput onSend={handleSendMessage} isDisabled={isDisabled} />
    </div>
  );
};

export default ChatApp;
