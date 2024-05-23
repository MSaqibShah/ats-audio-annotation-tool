import { React, useState, useEffect } from "react";
import "./intentsTable.css";
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

const IntentsTable = ({ intents, fetchIntents }) => {
  const [displayingIntents, setDisplayingIntents] = useState(intents);

  useEffect(() => {
    // This effect ensures that displayingIntents is updated when the intents prop changes
    setDisplayingIntents(intents);
  }, [intents]);

  const handleDelete = async (intentId) => {
    try {
      // Update the URL path as per your API endpoint
      const data = await axios.delete(
        `${BACKEND_URI}/api/audios/categories/intents/${intentId}`
      );

      if (data.status === 200) {
        alert("Intent deleted successfully");

        // Update the intents table
        fetchIntents();
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Error deleting intent");
        console.error("Error deleting intent:", error);
      }
    }
  };
  return (
    <div className="table">
      <div className="thread">
        <div className="row">
          <span>S.No.</span>
          <span>Name</span>
          <span>Value</span>
          <span>Delete</span>
        </div>
      </div>
      <div className="table-body">
        {displayingIntents.map((intent, index) => (
          <div className="row" key={intent._id}>
            <span>{index + 1}</span>
            <span>{intent.name}</span>
            <span>{intent.value}</span>
            <span>
              <button onClick={() => handleDelete(intent._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntentsTable;
