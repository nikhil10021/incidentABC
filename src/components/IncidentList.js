import React from "react";

/**
 * IncidentList Component
 * Displays a paginated list of incidents with filters and click-to-select functionality.
 *
 * Props:
 * - incidents: Array of incident objects
 * - total: Total number of incidents
 * - page: Current page number
 * - limit: Items per page
 * - onPageChange: Function to handle page changes
 * - onSelectIncident: Function to handle selecting an incident
 * - filters: Object containing current filter values
 * - setFilters: Function to update filters
 */
const IncidentList = ({
  incidents,
  total,
  page,
  limit,
  onPageChange,
  onSelectIncident,
  filters,
  setFilters,
}) => {
  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / limit);

  // -----------------------------
  // Handler: Update filter values
  // -----------------------------
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    onPageChange(1); // Reset to first page when filters change
  };

  return (
    <div>
      <h2>Incidents</h2>

      {/* Filter controls */}
      <div style={{ marginBottom: 10 }}>
        {/* Status filter */}
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        {/* Severity filter */}
        <select
          name="severity"
          value={filters.severity}
          onChange={handleFilterChange}
          style={{ marginLeft: 10 }}
        >
          <option value="">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Search input */}
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search title/description"
          style={{ marginLeft: 10 }}
        />
      </div>

      {/* Incident table */}
      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Created Time</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr
              key={i._id} // Unique key for React list
              style={{ cursor: "pointer" }}
              onClick={() => onSelectIncident(i._id)} // Select incident on row click
            >
              <td>{i.title}</td>
              <td>{i.severity}</td>
              <td>{i.status}</td>
              <td>{i.assignee}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IncidentList;
