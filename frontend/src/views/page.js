import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tooltip } from "react-tooltip";

import "./page.css";
import ChatApp from "../components/ChatApp";
import Button from "../components/Button";

import config from "../config";

import axios from "axios";

const Page = (props) => {
  const [audio, setAudio] = useState(null);
  const [categories, setCategories] = useState({});
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("");
  const [selectedResponse, setSelectedResponse] = useState("");
  const [betterResponse, setBetterResponse] = useState("");
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [entities, setEntities] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState({});
  const [audioIndex, setAudioIndex] = useState(0);
  const [conversationIndex, setConversationIndex] = useState(0);

  const [isDisabled, setIsDisabled] = useState(false);

  let BACKEND_URI = "";
  if (config.NODE_ENV === "dev") {
    BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
  } else if (config.NODE_ENV === "prod") {
    BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
  }
  useEffect(() => {
    clearLocalStrorage();
    setInLocalStorage("audioIndex", 0);
    setInLocalStorage("conversationIndex", 0);
    fetchConversation();
    fetchCategories();
  }, []);

  const displayAudio = () => {
    setAudioMeta();
    displayMessages();
  };

  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  const displayMessages = async () => {
    let local_conversation = JSON.parse(getFromLocalStorage("conversation"));
    let local_audio_index = parseInt(getFromLocalStorage("audioIndex"));
    let audio = local_conversation.audios[local_audio_index];
    // check if the audio type

    if (audio.type === "recieved") {
      try {
        local_conversation.audios[local_audio_index].audio =
          "data:audio/wav;base64," +
          local_conversation.audios[local_audio_index].audio;
      } catch (error) {
        console.error("Failed to fetch and convert audio:", error);
      }
    }

    let newMessages = [];
    for (let i = 0; i <= local_audio_index; i++) {
      newMessages.push({
        // id: local_conversation.audios.length + 1,
        id: `v_${i}`,
        author: local_conversation.audios[i].author,
        type: local_conversation.audios[i].type,
        content: "Voice message",
        // src: "data:audio/wav;base64," + local_conversation.audios[i].audio,
        src: local_conversation.audios[i].audio,
        db_id: `v_${local_conversation.audios[i]._id}`,
        audio_id: audio._id,
        timestamp: new Date().toTimeString().slice(0, 5),
      });
      newMessages.push({
        // id: local_conversation.audios.length + 2,
        id: `t_${i}`,
        author: local_conversation.audios[i].author, // Get from the backend
        type: local_conversation.audios[i].type, // Get from the backend
        content: "Transcription: " + local_conversation.audios[i].text,
        src: "",
        db_id: `t_${local_conversation.audios[i]._id}`,
        audio_id: audio._id,
        timestamp: new Date().toTimeString().slice(0, 5),
      });
    }

    // let messages = [
    //   {
    //     id: messages.length + 1,
    //     author: "System",
    //     type: "recieved",
    //     content: "Voice message",
    //     src: "data:audio/wav;base64," + audio.audio,
    //     audio_id: audio._id,
    //     timestamp: new Date().toTimeString().slice(0, 5),
    //   },
    //   {
    //     id: messages.length + 2,
    //     author: "System",
    //     type: "recieved",
    //     content: "Transcription: " + audio.text,
    //     src: "",
    //     audio_id: audio._id,
    //     timestamp: new Date().toTimeString().slice(0, 5),
    //   },
    // ];
    // setMessages((currentMessages) => [...currentMessages, ...newMessages]);
    setMessages(newMessages);
  };

  const setInLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  const getFromLocalStorage = (key) => {
    return localStorage.getItem(key);
  };

  const clearLocalStrorage = () => {
    localStorage.clear();
  };

  const setAudioMeta = () => {
    let local_conversation = JSON.parse(getFromLocalStorage("conversation"));
    let local_audio_index = parseInt(getFromLocalStorage("audioIndex"));
    let local_audio = local_conversation.audios[local_audio_index];

    if (local_audio.type === "sent") {
      // disable the metadata fields
      setIsDisabled(true);
      return;
    } else {
      setIsDisabled(false);
    }
    setCurrentTranscription(local_audio.text);
    setSelectedEmotion(local_audio.nlp.emotion._id);
    setSelectedGender(local_audio.nlp.gender);
    setSelectedIntent(local_audio.nlp.intent._id);
    setSelectedResponse(local_audio.nlp.best_response._id);
    let ent = local_audio.nlp.entities;
    let ent_str = "";
    for (let i = 0; i < ent.length; i++) {
      ent_str += ent[i].entity + " : " + ent[i].text + ";";
    }
    setEntities(ent_str);
  };

  const fetchConversation = async () => {
    try {
      let local_conversation_index = parseInt(
        getFromLocalStorage("conversationIndex")
      );
      const response = await fetch(
        `${BACKEND_URI}/api/calls/index/${local_conversation_index}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("No more conversations to annotate");
          // retain the last conversation index
          setInLocalStorage("conversationIndex", local_conversation_index - 1);
          setConversationIndex(local_conversation_index - 1);

          return;
        } else {
          throw new Error(
            "Failed to fetch conversation: " + response.statusText
          );
        }
      }

      const data = await response.json();

      //  save conversation in local storage
      setInLocalStorage("conversation", JSON.stringify(data.data));

      setConversation(data.data);

      setInLocalStorage("audioIndex", 0);
      setAudioIndex(0);

      if (data.data.audios.length == 0) {
        alert("No more convercations to annotate");
        return;
      }
      displayAudio();
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    }
  };

  const nextConversation = async () => {
    try {
      let local_conversation_index = parseInt(
        getFromLocalStorage("conversationIndex")
      );
      setConversationIndex(local_conversation_index + 1);
      setInLocalStorage("conversationIndex", local_conversation_index + 1);
      fetchConversation();
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/api/audios/categories`);
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const getCurrentAudioIndex = () => {
    return parseInt(getFromLocalStorage("audioIndex"));
  };
  const getCurrentAudioStatus = () => {
    let local_conversation = JSON.parse(getFromLocalStorage("conversation"));
    let local_audio_index = parseInt(getFromLocalStorage("audioIndex"));
    return local_conversation.audios[local_audio_index].status;
  };

  const checkConversationInLS = () => {
    let local_conversation = JSON.parse(getFromLocalStorage("conversation"));
    if (local_conversation !== null) {
      return local_conversation;
    } else {
      return undefined;
    }
  };
  const getCurrentCallStatus = () => {
    let local_conversation = JSON.parse(getFromLocalStorage("conversation"));
    return local_conversation.status;
  };

  const nextAudio = async () => {
    try {
      let local_audio_index = parseInt(getFromLocalStorage("audioIndex"));
      let local_conversation = JSON.parse(getFromLocalStorage("conversation"));

      if (local_audio_index + 1 >= local_conversation.audios.length) {
        alert("No more audios to annotate in this conversation");
        return;
      }
      setAudioIndex(local_audio_index + 1);
      setInLocalStorage("audioIndex", local_audio_index + 1);
      displayAudio();
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const previousAudio = async () => {
    try {
      let local_audio_index = parseInt(getFromLocalStorage("audioIndex"));
      let local_conversation = JSON.parse(getFromLocalStorage("conversation"));

      if (local_audio_index - 1 < 0) {
        alert("Cannot Move Beyond the first audio in this conversation");
        return;
      }
      setAudioIndex(local_audio_index - 1);
      setInLocalStorage("audioIndex", local_audio_index - 1);
      displayAudio();
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const updateMetadata = async () => {
    console.log("isDisabled", isDisabled);
    console.log("selectedEmotion", selectedEmotion);
    console.log("selectedGender", selectedGender);
    console.log("selectedIntent", selectedIntent);
    console.log("selectedResponse", selectedResponse);
    if (!isDisabled) {
      if (!selectedEmotion) {
        alert("Please select an emotion");
        return;
      }

      if (!selectedGender) {
        alert("Please select an gender");
        return;
      }

      if (!selectedIntent) {
        alert("Please select an intent");
        return;
      }

      if (!selectedResponse) {
        alert("Please select an response");
        return;
      }
    }

    let ents = entities.split(";");
    let entitiesArr = [];
    for (let i = 0; i < ents.length - 1; i++) {
      let ent = ents[i].split(":");
      entitiesArr.push({
        entity: ent[0].trim(),
        text: ent[1].trim(),
        label: "updated_entity",
      });
    }
    const payload = {
      nlp: {
        emotion: selectedEmotion,
        gender: selectedGender,
        intent: selectedIntent,
        best_response: selectedResponse,
        better_response: betterResponse,
        entities: entitiesArr,
      },
      status: "completed",
    };

    try {
      const local_conversation = JSON.parse(
        getFromLocalStorage("conversation")
      );
      const local_index = parseInt(getFromLocalStorage("audioIndex"));
      const local_audio = local_conversation.audios[local_index];
      const data = await axios.patch(
        `${BACKEND_URI}/api/audios/${local_audio._id}`,
        payload
      );

      if (data.status === 200) {
        local_audio.nlp = payload.nlp;
        local_audio.status = "completed";
        local_conversation.audios[local_index] = local_audio;
        setInLocalStorage("conversation", JSON.stringify(local_conversation));
        setConversation(local_conversation);

        alert("Metadata updated successfully");
      } else {
        alert("Error Updating Metadata");
      }
    } catch (error) {
      console.error("Failed to update metadata:", error);
    }
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleEmotionChange = (event) => {
    setSelectedEmotion(event.target.value);
  };

  const handleIntentChange = (event) => {
    setSelectedIntent(event.target.value);
  };

  const handleResponseChange = (event) => {
    setSelectedResponse(event.target.value);
  };

  const navigate = useHistory();

  const handleNavigateIntent = () => {
    navigate.push("/intent"); // Specify the path you want to redirect to
  };

  const handleNavigateEmotion = () => {
    navigate.push("/emotion"); // Specify the path you want to redirect to
  };

  const handleNavigateResponse = () => {
    navigate.push("/response"); // Specify the path you want to redirect to
  };

  const handleNavigateHome = () => {
    navigate.push("/"); // Specify the path you want to redirect to
  };
  return (
    <div className="page-container">
      <Button
        className={"f-btn-i"}
        text={"Intents"}
        onClick={handleNavigateIntent}
      />
      <Button
        className={"f-btn-e"}
        text={"Emotions"}
        onClick={handleNavigateEmotion}
      />
      <Button
        className={"f-btn-r"}
        text={"Responses"}
        onClick={handleNavigateResponse}
      />

      <Button
        className={"f-btn-h"}
        text={"Home"}
        onClick={handleNavigateHome}
      />

      <Helmet>
        <title>AAT - Audio Annotation Tool </title>
        <meta property="og:title" content="AAT - Audio Annotation Tool" />
      </Helmet>
      <div className="page-main">
        <div className="page-left">
          <span className="page-section-text">Customer Call Transcription</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider"
          />
          <div className="page-main-content">
            <div className="page-container1">
              {/* {<div className="page-current-transcription">
                <span className="page-text">
                  <span className="page-text01">Current Transcription</span>
                  <br></br>
                </span>

                <textarea
                  placeholder="Input Field"
                  legend="wash"
                  className="page-textarea textarea"
                  value={currentTranscription}
                >
                  {currentTranscription}
                </textarea>
              </div>} */}
              <div className="call-audio-stats">
                <div className="current-audio-index">
                  Call Index:{" "}
                  {conversation
                    ? conversationIndex
                      ? conversationIndex
                      : 0
                    : "null"}
                </div>
                <div className="current-audio-index">
                  Call Status:{" "}
                  {checkConversationInLS() ? getCurrentCallStatus() : "null"}
                </div>
                <div className="current-audio-index">
                  Audio Index:{" "}
                  {checkConversationInLS()
                    ? audioIndex
                      ? audioIndex
                      : 0
                    : "null"}
                </div>
                <div className="current-audio-index">
                  Audio Status:{" "}
                  {checkConversationInLS() ? getCurrentAudioStatus() : "null"}
                </div>
              </div>

              <div className="next-button">
                <Button
                  key={"better-response"}
                  text="Previous Audio"
                  onClick={previousAudio}
                />
              </div>

              <div className="next-button">
                <Button
                  key={"better-response"}
                  text="Next Audio"
                  onClick={nextAudio}
                />
              </div>

              <div className="next-button">
                <Button text="Update Metadata" onClick={updateMetadata} />
              </div>

              <div className="page-gender">
                <span className="page-text03">
                  <span>Gender</span>
                </span>
                <select
                  className="page-select"
                  value={selectedGender}
                  onChange={handleGenderChange}
                  disabled={isDisabled}
                >
                  <option className="page-option" value="">
                    Select Voice Type
                  </option>

                  {categories.genders &&
                    categories.genders.map((gender) => {
                      return (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="page-emotions">
                <select
                  className="page-select1"
                  value={selectedEmotion}
                  onChange={handleEmotionChange}
                  disabled={isDisabled}
                >
                  <option value="">Select Emotions</option>
                  {categories.emotions &&
                    categories.emotions.map((emotion) => {
                      return (
                        <option key={emotion.name} value={emotion._id}>
                          {emotion.name}
                        </option>
                      );
                    })}
                </select>
                <span className="page-text05">
                  <span>Emotions</span>
                </span>
              </div>

              <div className="page-current-transcription">
                <span className="page-text06">
                  <span>Entities</span>
                  <br></br>
                </span>
                <Tooltip id="entities" className="light" />

                <textarea
                  data-tooltip-id="entities"
                  data-tooltip-content="Comma Seperated values e.g name:john,age:25"
                  cols="1"
                  placeholder="Input Field"
                  legend="wash"
                  className="page-textarea textarea"
                  id="entities"
                  value={entities}
                  onChange={(e) => setEntities(e.target.value)}
                  disabled={isDisabled}
                >
                  {entities}
                </textarea>
              </div>
              {/* <div className="next-button">
                <Button text="Update Metadata" onClick={updateMetadata} />
              </div> */}
            </div>
          </div>
        </div>
        <div className="page-middle-home">
          <span className="page-section-text1">Dialog Flow</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider1"
          />

          {/* <div className="page-main-content1"> */}

          <ChatApp
            initialMessages={messages}
            audioIndex={getCurrentAudioIndex()}
            messageSetter={setMessages}
            isDisabled={isDisabled}
          ></ChatApp>
          {/* </div> */}
        </div>
        <div className="page-right">
          <span className="page-section-text2">Bot Response</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider2"
          />
          <div className="page-main-content1">
            <div className="page-container2">
              <div className="page-intent">
                <span className="page-text07">
                  <span>Intent</span>
                </span>
                <select
                  className="page-select2"
                  value={selectedIntent}
                  onChange={handleIntentChange}
                  disabled={isDisabled}
                >
                  <option value="">Select Intent</option>
                  {categories.intents &&
                    categories.intents.map((intent) => {
                      return (
                        <option key={intent.value} value={intent._id}>
                          {intent.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="page-bot-response">
                <span className="page-text09">
                  <span>Best Response</span>
                </span>
                <select
                  className="page-select3"
                  value={selectedResponse}
                  onChange={handleResponseChange}
                  disabled={isDisabled}
                >
                  <option value="">Select Bot Response</option>
                  {categories.responses &&
                    categories.responses.map((response) => {
                      return (
                        <option key={response.text} value={response._id}>
                          {response.text}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="page-container3">
                <textarea
                  placeholder="Input Field"
                  legend="wash"
                  className="page-textarea1 textarea"
                  value={betterResponse}
                  onChange={(e) => setBetterResponse(e.target.value)}
                  disabled={isDisabled}
                ></textarea>
                <span className="page-text11">Suggest Better Response</span>
              </div>
              <div className="next-button">
                <Button
                  key={"better-response"}
                  text="Next Call"
                  onClick={nextConversation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
