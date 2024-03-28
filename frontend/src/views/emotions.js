import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";

import "./emotions.css";
import ChatApp from "../components/ChatApp";
import Button from "../components/Button";
import EmotionsTable from "../components/emotionsTable";
import config from "../config";

import axios from "axios";

const Emotions = (props) => {
  // State to store emotions data
  const [emotions, setEmotions] = useState([]);
  const [newEmotionsName, setNewEmotionsName] = useState("");
  // Empty dependency array means this effect runs once on mount

  const handleAddEmotions = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.BACKEND_URL}:${config.BACKEND_PORT}/api/audios/categories/emotions`, // Update the URL as per your API endpoint
        {
          name: newEmotionsName,
        }
      );
      if (response.status === 200) {
        // reload the emotions table
        fetchEmotions();
        setNewEmotionsName(""); // Reset the input fields
      }
    } catch (error) {
      console.error("Error adding new emotions:", error);
    }
  };

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}:${config.BACKEND_PORT}/api/audios/categories/emotions`
      ); // Update the URL path as per your API endpoint
      if (response.data && response.data.emotions) {
        setEmotions(response.data.emotions);
      }
    } catch (error) {
      console.error("Error fetching emotions data:", error);
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
        <title>Emotions</title>
        <meta property="og:title" content="Page - exported project" />
      </Helmet>
      <div className="page-main">
        <div className="page-middle">
          <span className="page-section-text1">Emotions</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider1"
          />

          {console.log("emotions", emotions)}
          <EmotionsTable emotions={emotions} fetchEmotions={fetchEmotions} />

          <div className="add-emotions-form">
            <form onSubmit={handleAddEmotions}>
              <input
                type="text"
                value={newEmotionsName}
                onChange={(e) => setNewEmotionsName(e.target.value)}
                placeholder="Emotions Name"
                required
              />

              <button type="submit">Add Emotion</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emotions;
