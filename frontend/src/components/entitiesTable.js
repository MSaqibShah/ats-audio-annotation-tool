import { React, useState, useEffect } from "react";
import "./entitiesTable.css";
import axios from "axios";

import config from "../config";

let BACKEND_URI = "";

if (config.NODE_ENV === "dev") {
  BACKEND_URI = config.BACKEND_URL + ":" + config.BACKEND_PORT;
} else if (config.NODE_ENV === "prod") {
  BACKEND_URI = config.FRONTEND_URL + ":" + config.BACKEND_PORT;
}

// Mock delete function

const EntitiesTable = ({ entities, fetchEntities }) => {
  const [displayingEntities, setDisplayingEntities] = useState(entities);

  useEffect(() => {
    // This effect ensures that displayingEntities is updated when the entities prop changes
    setDisplayingEntities(entities);
  }, [entities]);

  const handleDelete = async (entitiesId) => {
    try {
      // Update the URL path as per your API endpoint
      const data = await axios.delete(
        `${BACKEND_URI}/api/audios/categories/entities/${entitiesId}`
      );

      if (data.status === 200) {
        alert("Entities deleted successfully");

        // Update the entities table
        fetchEntities();
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Error deleting entities");
        console.error("Error deleting entities:", error);
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
        {displayingEntities.map((entities, index) => (
          <div className="row" key={entities._id}>
            <span>{index + 1}</span>
            <span>{entities.entity_key}</span>
            <span>
              <button onClick={() => handleDelete(entities._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntitiesTable;
