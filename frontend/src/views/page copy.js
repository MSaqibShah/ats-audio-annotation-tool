import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

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
  let BACKEND_URI = "";
  if (config.NODE_ENV === "dev") {
    BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
  } else if (config.NODE_ENV === "prod") {
    BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/api/audios/categories`);
      const data = await response.json();
      setCategories(data.data);

      if (!audio) {
        const data = await axios.get(
          // `${BACKEND_URI}/api/audios/random/waiting`
          `${BACKEND_URI}/api/audios/index/0`
        );
        if (data.status == 404 && data.data.audio === null) {
          console.log("No more audios to annotate");
          alert("No audios to annotate");
          return;
        }
        if (data.status == 200 && data.data.audio === null) {
          alert(data.data.message);
        }
        setAudio(data.data.audio);
        console.log(audio);
        data.data.audio && setCurrentTranscription(data.data.audio.text);
        if (data.data.audio !== null) {
          let ent = data.data.audio.nlp.entities;
          let ent_str = "";
          for (let i = 0; i < ent.length; i++) {
            ent_str += ent[i].entity + " : " + ent[i].text + ";";
          }

          setEntities(ent_str);
          console.log("ENTITIES:", entities);
        }
        data.data.audio && setSelectedGender(data.data.audio.nlp.gender);
        data.data.audio && setSelectedEmotion(data.data.audio.nlp.emotion._id);
        data.data.audio && setSelectedIntent(data.data.audio.nlp.intent._id);
        data.data.audio &&
          setSelectedResponse(data.data.audio.nlp.best_response._id);

        setMessages(
          data.data.audio
            ? [
                {
                  id: 0,
                  author: "System",
                  type: "recieved",
                  content: "Voice message",
                  src: "data:audio/wav;base64," + data.data.audio.audio,
                  audio_id: data.data.audio._id,
                  timestamp: new Date().toTimeString().slice(0, 5),
                },
                {
                  id: 1,
                  author: "System",
                  type: "recieved",
                  content: "Transcription: " + data.data.audio.text,
                  src: "",
                  audio_id: data.data.audio._id,
                  timestamp: new Date().toTimeString().slice(0, 5),
                },
              ]
            : []
        );
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };
  const handleClick = async () => {
    const data = await axios.get(`${BACKEND_URI}/api/audios/random/waiting`);

    if (data.data.audio === null) {
      alert(data.data.message);
      setBetterResponse("");
      setSelectedEmotion("");
      setSelectedGender("");
      setSelectedIntent("");
      setSelectedResponse("");
    }
    setAudio(data.data.audio);
    setCurrentTranscription(data.data.audio ? data.data.audio.text : "");
    if (data.data.audio !== null) {
      let ent = data.data.audio.nlp.entities;
      let ent_str = "";
      for (let i = 0; i < ent.length; i++) {
        ent_str += ent[i].entity + " : " + ent[i].text + ";";
      }

      setEntities(ent_str);
      console.log("ENTITIES:", entities);
    } else {
      setEntities("");
    }
    setSelectedGender(data.data.audio ? data.data.audio.nlp.gender : "");
    setSelectedEmotion(
      data.data.audio ? `${data.data.audio.nlp.emotion._id}` : ""
    );
    setSelectedIntent(
      data.data.audio ? `${data.data.audio.nlp.intent._id}` : ""
    );
    setSelectedResponse(
      data.data.audio ? `${data.data.audio.nlp.best_response._id}` : ""
    );

    setMessages(
      data.data.audio
        ? [
            {
              id: 0,
              author: "System",
              type: "recieved",
              content: "Voice message",
              src: "data:audio/wav;base64," + data.data.audio.audio,
              audio_id: data.data.audio._id,
              timestamp: new Date().toTimeString().slice(0, 5),
            },
            {
              id: 1,
              author: "System",
              type: "recieved",
              content: "Transcription: " + data.data.audio.text,
              src: "",
              audio_id: data.data.audio._id,
              timestamp: new Date().toTimeString().slice(0, 5),
            },
          ]
        : []
    );
  };

  const nextAudio = async () => {
    // Get current audio index
    let index = audio.index;
    // Get next audio
    try {
      const data = await axios.get(
        `${BACKEND_URI}/api/audios/index/${index + 1}`
      );

      // const data = await axios.get(`${BACKEND_URI}/api/audios/random/waiting`);

      // if (data.data.audio === null) {
      //   alert(data.data.message);
      //   setBetterResponse("");
      //   setSelectedEmotion("");
      //   setSelectedGender("");
      //   setSelectedIntent("");
      //   setSelectedResponse("");
      // }
      setAudio(data.data.audio);
      setCurrentTranscription(data.data.audio ? data.data.audio.text : "");
      if (data.data.audio !== null) {
        let ent = data.data.audio.nlp.entities;
        let ent_str = "";
        for (let i = 0; i < ent.length; i++) {
          ent_str += ent[i].entity + " : " + ent[i].text + ";";
        }

        setEntities(ent_str);
        console.log("ENTITIES:", entities);
      } else {
        setEntities("");
      }
      setSelectedGender(data.data.audio ? data.data.audio.nlp.gender : "");
      setSelectedEmotion(
        data.data.audio ? `${data.data.audio.nlp.emotion._id}` : ""
      );
      setSelectedIntent(
        data.data.audio ? `${data.data.audio.nlp.intent._id}` : ""
      );
      setSelectedResponse(
        data.data.audio ? `${data.data.audio.nlp.best_response._id}` : ""
      );

      setMessages(
        data.data.audio
          ? [
              {
                id: 0,
                author: "System",
                type: "recieved",
                content: "Voice message",
                src: "data:audio/wav;base64," + data.data.audio.audio,
                audio_id: data.data.audio._id,
                timestamp: new Date().toTimeString().slice(0, 5),
              },
              {
                id: 1,
                author: "System",
                type: "recieved",
                content: "Transcription: " + data.data.audio.text,
                src: "",
                audio_id: data.data.audio._id,
                timestamp: new Date().toTimeString().slice(0, 5),
              },
            ]
          : []
      );
    } catch (error) {
      if (error.response.status === 404) {
        alert("No more audios to annotate");
        return;
      }
    }
  };
  const previousAudio = async () => {
    // Get current audio index
    let index = audio.index;

    if (index - 1 < 0) {
      alert("Cannot go back further than the first audio");
      return;
    }
    // Get previous audio
    try {
      const data = await axios.get(
        `${BACKEND_URI}/api/audios/index/${index - 1}`
      );

      // const data = await axios.get(`${BACKEND_URI}/api/audios/random/waiting`);

      // if (data.data.audio === null) {
      //   alert(data.data.message);
      //   setBetterResponse("");
      //   setSelectedEmotion("");
      //   setSelectedGender("");
      //   setSelectedIntent("");
      //   setSelectedResponse("");
      // }
      setAudio(data.data.audio);
      setCurrentTranscription(data.data.audio ? data.data.audio.text : "");
      if (data.data.audio !== null) {
        let ent = data.data.audio.nlp.entities;
        let ent_str = "";
        for (let i = 0; i < ent.length; i++) {
          ent_str += ent[i].entity + " : " + ent[i].text + ";";
        }

        setEntities(ent_str);
        console.log("ENTITIES:", entities);
      } else {
        setEntities("");
      }
      setSelectedGender(data.data.audio ? data.data.audio.nlp.gender : "");
      setSelectedEmotion(
        data.data.audio ? `${data.data.audio.nlp.emotion._id}` : ""
      );
      setSelectedIntent(
        data.data.audio ? `${data.data.audio.nlp.intent._id}` : ""
      );
      setSelectedResponse(
        data.data.audio ? `${data.data.audio.nlp.best_response._id}` : ""
      );

      setMessages(
        data.data.audio
          ? [
              {
                id: 0,
                author: "System",
                type: "recieved",
                content: "Voice message",
                src: "data:audio/wav;base64," + data.data.audio.audio,
                audio_id: data.data.audio._id,
                timestamp: new Date().toTimeString().slice(0, 5),
              },
              {
                id: 1,
                author: "System",
                type: "recieved",
                content: "Transcription: " + data.data.audio.text,
                src: "",
                audio_id: data.data.audio._id,
                timestamp: new Date().toTimeString().slice(0, 5),
              },
            ]
          : []
      );
    } catch (error) {
      if (error.response.status === 404) {
        alert("No more audios to annotate");
        return;
      }
    }
  };
  const updateMetadata = async () => {
    if (!selectedEmotion) {
      alert("Please select an emotion");
    }

    if (!selectedGender) {
      alert("Please select an gender");
    }

    if (!selectedIntent) {
      alert("Please select an intent");
    }

    if (!selectedResponse) {
      alert("Please select an response");
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
      const data = await axios.patch(
        `${BACKEND_URI}/api/audios/${audio._id}`,
        payload
      );

      if (data.status === 200) {
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

              <div className="current-audio-index">
                Current Audio Index:{" "}
                {audio ? (audio.index ? audio.index : 0) : "null"}
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

                <textarea
                  cols="1"
                  placeholder="Input Field"
                  legend="wash"
                  className="page-textarea textarea"
                  id="entities"
                  value={entities}
                  onChange={(e) => setEntities(e.target.value)}
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

          <ChatApp initialMessages={messages}></ChatApp>
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
                ></textarea>
                <span className="page-text11">Suggest Better Response</span>
              </div>
              {/* <div className="next-button">
                <Button
                  key={"better-response"}
                  text="Fetch Audio"
                  onClick={handleClick}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
