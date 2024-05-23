import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";

import "./intent.css";
import ChatApp from "../components/ChatApp";
import Button from "../components/Button";
import IntentsTable from "../components/intentsTable";

import axios from "axios";

import config from "../config";

let BACKEND_URI = "";
  if (config.NODE_ENV === "dev") {
    BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
  } else if (config.NODE_ENV === "prod") {
    BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
  }

const Intent = (props) => {
  // State to store intents data
  const [intents, setIntents] = useState([]);
  const [newIntentName, setNewIntentName] = useState("");
  const [newIntentValue, setNewIntentValue] = useState("");
  // Empty dependency array means this effect runs once on mount

  const handleAddIntent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URI}/api/audios/categories/intents`, // Update the URL as per your API endpoint
        {
          name: newIntentName,
          value: newIntentValue,
        }
      );
      if (response.status === 200) {
        // reload the intents table
        fetchIntents();
        setNewIntentName(""); // Reset the input fields
        setNewIntentValue("");
      }
    } catch (error) {
      console.error("Error adding new intent:", error);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URI}/api/audios/categories/intents`
      ); // Update the URL path as per your API endpoint
      if (response.data && response.data.intents) {
        setIntents(response.data.intents);
      }
    } catch (error) {
      console.error("Error fetching intents data:", error);
    }
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
      </div>
      <Helmet>
        <title>Intents</title>
        <meta property="og:title" content="Page - exported project" />
      </Helmet>
      <div className="page-main">
        <div className="page-middle">
          <span className="page-section-text1">Intents</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider1"
          />

          {console.log("intents", intents)}
          <IntentsTable intents={intents} fetchIntents={fetchIntents} />

          <div className="add-intent-form">
            <form onSubmit={handleAddIntent}>
              <input
                type="text"
                value={newIntentName}
                onChange={(e) => setNewIntentName(e.target.value)}
                placeholder="Intent Name"
                required
              />
              <input
                type="text"
                value={newIntentValue}
                onChange={(e) => setNewIntentValue(e.target.value)}
                placeholder="Intent Value"
                required
              />
              <button type="submit">Add Intent</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intent;
