const express = require('express');
const router = express.Router();
const { incidents } = require('../data'); // Import incidents array from data.js

// --------------------
// Utility: Generate next unique ID
// Returns 1 if empty, otherwise max(id) + 1
// --------------------
const getNextId = (arr) => (arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1);

// ============================================================================
// GET /api/incidents
// Fetch all incidents with optional filters & pagination
// Query Params: status, severity, search, page, limit
// ============================================================================
router.get('/', (req, res) => {
  let { status, severity, search, page = 1, limit = 10 } = req.query;

  // Convert query params into integers for pagination
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // Start with a copy of all incidents
  let filtered = [...incidents];

  // Filter by status (if provided)
  if (status) {
    filtered = filtered.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by severity (if provided)
  if (severity) {
    filtered = filtered.filter(i => i.severity.toLowerCase() === severity.toLowerCase());
  }

  // Search by title or description (case-insensitive)
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      i => i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term)
    );
  }

  // Apply pagination
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  // Send paginated response
  res.json({
    total: filtered.length,
    page,
    limit,
    incidents: paged,
  });
});

// ============================================================================
// GET /api/incidents/:id
// Fetch a single incident by ID
// ============================================================================
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const incident = incidents.find(i => i.id === id);

  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  res.json(incident);
});

// ============================================================================
// POST /api/incidents
// Create a new incident
// Required fields: title, severity
// ============================================================================
router.post('/', (req, res) => {
  const { title, description = '', severity, assignee = '' } = req.body;

  // Validation: title and severity are mandatory
  if (!title || !severity) {
    return res.status(400).json({ error: 'Title and severity are required' });
  }

  // Build new incident object
  const newIncident = {
    id: getNextId(incidents),
    title,
    description,
    severity,
    status: 'Open',         // default status
    assignee,
    createdAt: new Date(),  // timestamp
    comments: [],           // initialize empty comments array
  };

  // Save in memory
  incidents.push(newIncident);

  res.status(201).json(newIncident);
});

// ============================================================================
// PATCH /api/incidents/:id/status
// Update the status of an incident
// ============================================================================
router.patch('/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  const incident = incidents.find(i => i.id === id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  incident.status = status; // update status
  res.json(incident);
});

// ============================================================================
// POST /api/incidents/:id/comments
// Add a new comment to an incident
// Required field: text
// ============================================================================
router.post('/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text is required' });

  const incident = incidents.find(i => i.id === id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  // Create new comment with auto-incremented ID
  const newComment = {
    id: incident.comments.length ? Math.max(...incident.comments.map(c => c.id)) + 1 : 1,
    text,
    createdAt: new Date(),
  };

  // Add new comment at the beginning (newest first)
  incident.comments.unshift(newComment);

  res.status(201).json(newComment);
});

module.exports = router;
