import { React, useState, useEffect } from "react";
import "./responseTable.css";
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

const ResponsesTable = ({ responses, fetchResponses }) => {
  const [displayingResponses, setDisplayingResponses] = useState(responses);

  useEffect(() => {
    // This effect ensures that displayingResponses is updated when the responses prop changes
    setDisplayingResponses(responses);
  }, [responses]);

  const handleDelete = async (responsesId) => {
    try {
      // Update the URL path as per your API endpoint
      const data = await axios.delete(
        `${BACKEND_URI}/api/audios/categories/responses/${responsesId}`
      );

      if (data.status === 200) {
        alert("Responses deleted successfully");

        // Update the responses table
        fetchResponses();
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Error deleting responses");
        console.error("Error deleting responses:", error);
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
        {displayingResponses.map((responses, index) => (
          <div className="row" key={responses._id}>
            <span>{index + 1}</span>
            <span>{responses.text}</span>
            <span>
              <button onClick={() => handleDelete(responses._id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsesTable;
