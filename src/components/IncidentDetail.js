import React, { useState } from "react";

/**
 * IncidentDetail Component
 * Displays full details of a single incident including status and comments.
 *
 * Props:
 * - incident: Object containing incident details
 * - onClose: Function to close the detail view
 * - onStatusChange: Function to update incident status
 * - onAddComment: Function to add a new comment
 */
const IncidentDetail = ({ incident, onClose, onStatusChange, onAddComment }) => {
  // Local state to hold new comment input
  const [commentText, setCommentText] = useState("");

  // Predefined status options
  const statusOptions = ["open", "in progress", "closed"];

  // If incident is not loaded yet, show loading message
  if (!incident) return <div>Loading...</div>;

  // -----------------------------
  // Handler: Status change
  // -----------------------------
  const handleStatusChange = (e) => {
    onStatusChange(incident._id, e.target.value); // Trigger parent callback
  };

  // -----------------------------
  // Handler: Add a new comment
  // -----------------------------
  const handleAddComment = (e) => {
    e.preventDefault(); // Prevent form submit refresh
    if (!commentText) return; // Do nothing if input is empty
    onAddComment(incident._id, commentText); // Trigger parent callback
    setCommentText(""); // Clear input after adding
  };

  return (
    <div>
      {/* Back button to go to list view */}
      <button onClick={onClose}>Back to list</button>

      {/* Incident basic info */}
      <h2>{incident.title}</h2>
      <p>
        <strong>Description:</strong> {incident.description || "-"}
      </p>
      <p>
        <strong>Severity:</strong> {incident.severity}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <select value={incident.status} onChange={handleStatusChange}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </p>
      <p>
        <strong>Assignee:</strong> {incident.assignee || "-"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(incident.createdAt).toLocaleString()}
      </p>

      {/* Comments section */}
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment"
        />
        <button type="submit">Add</button>
      </form>

      {/* List existing comments */}
      <ul>
        {incident.comments &&
          incident.comments.map((c) => (
            <li key={c._id}>
              {c.text}{" "}
              <small>({new Date(c.createdAt).toLocaleString()})</small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default IncidentDetail;
