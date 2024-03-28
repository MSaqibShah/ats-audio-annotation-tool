import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";

import "./response.css";
import ChatApp from "../components/ChatApp";
import Button from "../components/Button";
import ResponsesTable from "../components/responseTable";
import config from "../config";

import axios from "axios";

const Responses = (props) => {
  // State to store responses data
  const [responses, setResponses] = useState([]);
  const [newResponsesName, setNewResponsesName] = useState("");
  // Empty dependency array means this effect runs once on mount

  const handleAddResponses = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.BACKEND_URL}:${config.BACKEND_PORT}/api/audios/categories/responses`, // Update the URL as per your API endpoint
        {
          text: newResponsesName,
        }
      );
      if (response.status === 200) {
        // reload the responses table
        fetchResponses();
        setNewResponsesName(""); // Reset the input fields
      }
    } catch (error) {
      console.error("Error adding new responses:", error);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}:${config.BACKEND_PORT}/api/audios/categories/responses`
      ); // Update the URL path as per your API endpoint
      if (response.data && response.data.responses) {
        setResponses(response.data.responses);
      }
    } catch (error) {
      console.error("Error fetching responses data:", error);
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
        <title>Responses</title>
        <meta property="og:title" content="Page - exported project" />
      </Helmet>
      <div className="page-main">
        <div className="page-middle">
          <span className="page-section-text1">Responses</span>
          <img
            alt="Line11012"
            src="/external/line11012-t6g.svg"
            className="page-divider1"
          />

          {console.log("responses", responses)}
          <ResponsesTable
            responses={responses}
            fetchResponses={fetchResponses}
          />

          <div className="add-responses-form">
            <form onSubmit={handleAddResponses}>
              <input
                type="text"
                value={newResponsesName}
                onChange={(e) => setNewResponsesName(e.target.value)}
                placeholder="Responses Name"
                required
              />

              <button type="submit">Add Response</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Responses;
