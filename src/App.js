import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Import API helper functions
import {
  fetchIncidents,
  createIncident,
  updateIncidentStatus,
  addIncidentComment,
  fetchIncidentById,
} from './api';

// Import child components
import IncidentList from './components/IncidentList';
import IncidentForm from './components/IncidentForm';
import IncidentDetail from './components/IncidentDetail';

function App() {
  // -----------------------------
  // Component state
  // -----------------------------
  const [incidents, setIncidents] = useState([]); // List of incidents
  const [filters, setFilters] = useState({ status: '', severity: '', search: '' }); // Filters for list
  const [page, setPage] = useState(1); // Current pagination page
  const [total, setTotal] = useState(0); // Total number of incidents
  const [limit] = useState(10); // Items per page
  const [selectedIncidentId, setSelectedIncidentId] = useState(null); // ID of incident currently selected
  const [selectedIncident, setSelectedIncident] = useState(null); // Full data of selected incident

  // -----------------------------
  // Load incidents from API with filters and pagination
  // -----------------------------
  const loadIncidents = () => {
    fetchIncidents({ ...filters, page, limit }).then(res => {
      setIncidents(res.data.incidents);
      setTotal(res.data.total);
    });
  };

  // -----------------------------
  // Reload incidents whenever filters or page change
  // -----------------------------
  useEffect(() => {
    loadIncidents();
  }, [filters, page]);

  // -----------------------------
  // Handler: Create new incident
  // -----------------------------
  const handleCreateIncident = (data) => {
    createIncident(data).then(() => {
      loadIncidents(); // Refresh list after creation
    });
  };

  // -----------------------------
  // Handler: Select an incident to view details
  // -----------------------------
  const handleSelectIncident = (id) => {
    setSelectedIncidentId(id);
    fetchIncidentById(id).then(res => setSelectedIncident(res.data)); // Load full incident details
  };

  // -----------------------------
  // Handler: Close incident detail view
  // -----------------------------
  const handleCloseDetail = () => {
    setSelectedIncidentId(null);
    setSelectedIncident(null);
  };

  // -----------------------------
  // Handler: Update incident status
  // -----------------------------
  const handleStatusChange = (id, status) => {
    updateIncidentStatus(id, status).then(() => {
      loadIncidents(); // Refresh list to reflect status change

      // If the updated incident is currently selected, reload its details
      if (selectedIncidentId === id) {
        fetchIncidentById(id).then(res => setSelectedIncident(res.data));
      }
    });
  };

  // -----------------------------
  // Handler: Add comment to an incident
  // -----------------------------
  const handleAddComment = (id, text) => {
    addIncidentComment(id, text).then(() => {
      // Refresh selected incident details to show new comment
      fetchIncidentById(id).then(res => setSelectedIncident(res.data));
    });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="App" style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Incident Desk Dashboard</h1>

      {!selectedIncidentId ? (
        // If no incident is selected, show form and list
        <>
          <IncidentForm onCreate={handleCreateIncident} />
          <IncidentList
            incidents={incidents}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onSelectIncident={handleSelectIncident}
            filters={filters}
            setFilters={setFilters}
          />
        </>
      ) : (
        // If an incident is selected, show detail view
        <IncidentDetail
          incident={selectedIncident}
          onClose={handleCloseDetail}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}

export default App;
