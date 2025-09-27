import React, { useState } from "react";

/**
 * IncidentForm Component
 * Form for creating a new incident.
 *
 * Props:
 * - onCreate: Function to handle creating a new incident
 */
const IncidentForm = ({ onCreate }) => {
  // -----------------------------
  // Local state for form inputs
  // -----------------------------
  const [title, setTitle] = useState(""); // Incident title
  const [description, setDescription] = useState(""); // Optional description
  const [severity, setSeverity] = useState("low"); // Default severity
  const [assignee, setAssignee] = useState(""); // Optional assignee

  // -----------------------------
  // Handler: Submit form
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!title) return alert("Title is required"); // Basic validation

    // Call parent callback to create new incident
    // Normalize severity to lowercase to match backend
    onCreate({ title, description, severity: severity.toLowerCase(), assignee });

    // Reset form fields after submission
    setTitle("");
    setDescription("");
    setSeverity("low");
    setAssignee("");
  };

  return (
    <form onSubmit={handleSubmit} className="incident-form-card">
      <h2>Create Incident</h2>

      {/* Title input */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          required
        />
      </div>

      {/* Description input */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      {/* Severity select */}
      <div>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Assignee input */}
      <div>
        <input
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee"
        />
      </div>

      {/* Submit button */}
      <button type="submit">Create</button>
    </form>
  );
};

export default IncidentForm;
