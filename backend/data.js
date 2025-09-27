// Sample in-memory incidents data
// Each incident has an ID, title, description, severity, status, assignee, creation timestamp, and comments array

const incidents = [
    {
      id: 1,
      title: "Server down", // Short description of the issue
      description: "The main server is not responding", // Detailed info
      severity: "High", // Severity can be Low, Medium, High
      status: "Open", // Current status: Open, In Progress, Closed
      assignee: "Alice", // Person responsible for resolving
      createdAt: new Date("2025-09-25T09:45:00"), // Timestamp of creation
      comments: [
        {
          id: 1, // Unique ID for comment
          text: "Investigating the issue", // Comment text
          createdAt: new Date("2025-09-25T10:00:00"), // Timestamp of comment
        },
      ],
    },
    {
      id: 2,
      title: "Database latency issue",
      description: "Queries are slow",
      severity: "Medium",
      status: "In Progress",
      assignee: "Bob",
      createdAt: new Date("2025-09-25T08:30:00"),
      comments: [], // No comments yet
    },
  ];
  
  // Export incidents array to be used by routes or tests
  module.exports = { incidents };
  