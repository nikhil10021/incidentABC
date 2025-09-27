# Incident Desk API Design

## Data Modeling
- Incidents stored in-memory as objects with fields: id, title, description, severity, status, assignee, createdAt, comments.
- Comments nested within incidents as arrays; each comment has id, text, createdAt.
- Using in-memory storage to keep this minimal and fast for the assignment purpose.

## API Endpoints
- RESTful endpoints under `/api/incidents`.
- Support querying incidents with optional filters (status, severity), search by title/description, pagination.
- Create, read, and patch endpoints follow standard REST semantics.
- Comments added through nested POST endpoint on incidents, latest comments stored at start of array.

## Trade-offs and Assumptions
- No database persistence; data resets on server restart.
- Simple ID generation using max+1 approach, no concurrency protections.
- Basic validation on required fields; more complex validation omitted for brevity.
- CORS enabled globally to support React frontend.
- Focused on clarity and simplicity over advanced features.

