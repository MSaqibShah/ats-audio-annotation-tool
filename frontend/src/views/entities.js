import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";

import "./entities.css";
import ChatApp from "../components/ChatApp";
import Button from "../components/Button";
import EntitiesTable from "../components/entitiesTable";
import config from "../config";

import axios from "axios";

let BACKEND_URI = "";
if (config.NODE_ENV === "dev") {
  BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
} else if (config.NODE_ENV === "prod") {
  BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
}

const Entities = (props) => {
  // State to store entities data
  const [entities, setEntities] = useState([]);
  const [newEntitiesName, setNewEntitiesName] = useState("");
  // Empty dependency array means this effect runs once on mount

  const handleAddEntities = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URI}/api/audios/categories/entities`, // Update the URL as per your API endpoint
        {
          entity_key: newEntitiesName,
        }
      );
      console.log(response);
      if (response.status === 201) {
        // reload the entities table
        fetchEntities();
        setNewEntitiesName(""); // Reset the input fields
      }
    } catch (error) {
      console.error("Error adding new entities:", error);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URI}/api/audios/categories/entities`
      ); // Update the URL path as per your API endpoint
      if (response.data && response.data.entities) {
        setEntities(response.data.entities);
      }
    } catch (error) {
      console.error("Error fetching entities data:", error);
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

  const handleNavigateEntities = () => {
    navigate.push("/entities"); // Specify the path you want to redirect to
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
        className={"f-btn-en"}
        text={"Entities"}
        onClick={handleNavigateEntities}
      />
      <Button
        className={"f-btn-h"}
        text={"Home"}
        onClick={handleNavigateHome}
      />

      <Helmet>
        <title>Entities</title>
        <meta property="og:title" content="Page - exported project" />
      </Helmet>
      <div className="page-main">
        <div className="page-middle">
          <span className="page-section-text1">Entities</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider1"
          />

          <EntitiesTable entities={entities} fetchEntities={fetchEntities} />

          <div className="add-entities-form">
            <form onSubmit={handleAddEntities}>
              <input
                type="text"
                value={newEntitiesName}
                onChange={(e) => setNewEntitiesName(e.target.value)}
                placeholder="Entities Name"
                required
              />

              <button type="submit">Add Entity</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entities;
