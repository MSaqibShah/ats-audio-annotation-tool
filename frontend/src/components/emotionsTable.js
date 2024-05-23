import { React, useState, useEffect } from "react";
import "./emotionsTable.css";
import axios from "axios";


import config from "../config";


let BACKEND_URI = "";

if (config.NODE_ENV === "dev") {
  BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
}
else if (config.NODE_ENV === "prod") {
  BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
}


// Mock delete function

const EmotionsTable = ({ emotions, fetchEmotions }) => {
  const [displayingEmotions, setDisplayingEmotions] = useState(emotions);

  useEffect(() => {
    // This effect ensures that displayingEmotions is updated when the emotions prop changes
    setDisplayingEmotions(emotions);
  }, [emotions]);

  const handleDelete = async (emotionsId) => {
    try {
      // Update the URL path as per your API endpoint
      const data = await axios.delete(
        `${BACKEND_URI}/api/audios/categories/emotions/${emotionsId}`
      );

      if (data.status === 200) {
        alert("Emotions deleted successfully");

        // Update the emotions table
        fetchEmotions();
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Error deleting emotions");
        console.error("Error deleting emotions:", error);
      }
    }
  };
  return (
    <div className="table">
      <div className="thread">
        <div className="row">
          <span>S.No.</span>
          <span>Name</span>
          <span>Delete</span>
        </div>
      </div>
      <div className="table-body">
        {displayingEmotions.map((emotions, index) => (
          <div className="row" key={emotions._id}>
            <span>{index + 1}</span>
            <span>{emotions.name}</span>
            <span>
              <button onClick={() => handleDelete(emotions._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionsTable;
