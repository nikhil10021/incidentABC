const request = require('supertest');
const express = require('express');
const incidentsRouter = require('../routes/incidents');

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use('/api/incidents', incidentsRouter);

describe('Incidents API', () => {

  // -----------------------------
  // Test: GET all incidents
  // -----------------------------
  it('GET /api/incidents - should list incidents', async () => {
    const res = await request(app).get('/api/incidents');

    expect(res.statusCode).toBe(200); // Should return HTTP 200
    expect(res.body).toHaveProperty('incidents'); // Response contains 'incidents' key
    expect(Array.isArray(res.body.incidents)).toBe(true); // 'incidents' should be an array
  });

  // -----------------------------
  // Test: Create a new incident
  // -----------------------------
  it('POST /api/incidents - should create a new incident', async () => {
    const newIncident = { title: 'Test Incident', severity: 'Low' };

    const res = await request(app)
      .post('/api/incidents')
      .send(newIncident);

    expect(res.statusCode).toBe(201); // Should return HTTP 201 for creation
    expect(res.body).toHaveProperty('id'); // New incident has an ID
    expect(res.body.title).toBe(newIncident.title); // Title matches input
  });

  // -----------------------------
  // Test: Fail to create incident without required fields
  // -----------------------------
  it('POST /api/incidents - should fail without title or severity', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .send({ description: 'No title or severity' });

    expect(res.statusCode).toBe(400); // Bad request
    expect(res.body).toHaveProperty('error'); // Should return error message
  });

  // -----------------------------
  // Test: Get a single incident by ID
  // -----------------------------
  it('GET /api/incidents/:id - should get incident detail if exists', async () => {
    const res = await request(app).get('/api/incidents/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1); // ID should match requested
  });

  // -----------------------------
  // Test: Get non-existent incident
  // -----------------------------
  it('GET /api/incidents/:id - should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/incidents/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error'); // Error message returned
  });

  // -----------------------------
  // Test: Update incident status
  // -----------------------------
  it('PATCH /api/incidents/:id/status - should update status', async () => {
    const res = await request(app)
      .patch('/api/incidents/1/status')
      .send({ status: 'Closed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Closed'); // Status should be updated
  });

  // -----------------------------
  // Test: Fail to update status without providing status
  // -----------------------------
  it('PATCH /api/incidents/:id/status - should fail with missing status', async () => {
    const res = await request(app)
      .patch('/api/incidents/1/status')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error'); // Error message returned
  });

  // -----------------------------
  // Test: Fail to update status for invalid incident
  // -----------------------------
  it('PATCH /api/incidents/:id/status - should fail for invalid incident', async () => {
    const res = await request(app)
      .patch('/api/incidents/9999/status')
      .send({ status: 'Open' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // -----------------------------
  // Test: Add a comment to an incident
  // -----------------------------
  it('POST /api/incidents/:id/comments - should add comment', async () => {
    const res = await request(app)
      .post('/api/incidents/1/comments')
      .send({ text: 'New comment' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id'); // Comment has unique ID
    expect(res.body.text).toBe('New comment'); // Text matches input
  });

  // -----------------------------
  // Test: Fail to add comment without text
  // -----------------------------
  it('POST /api/incidents/:id/comments - should fail without text', async () => {
    const res = await request(app)
      .post('/api/incidents/1/comments')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error'); // Error message returned
  });

  // -----------------------------
  // Test: Fail to add comment for invalid incident
  // -----------------------------
  it('POST /api/incidents/:id/comments - should fail for invalid incident', async () => {
    const res = await request(app)
      .post('/api/incidents/9999/comments')
      .send({ text: 'Comment' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error'); // Error message returned
  });

});
