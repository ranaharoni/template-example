require("dotenv").config();

// Express App Setup
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getItems, decorateModelCRUD } = require("./db");
const TodoItem = require("./models/TodoItem");
const jsonResponseFormat = require("./middlewares/jsonResponseFormat");

// Add Database operations to model (active record)
decorateModelCRUD(TodoItem);

// Config
const config = require("./config");

// Initialization
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(jsonResponseFormat);

// Serve static files
app.use(express.static("public"));

// Express route handlers
app.get("/v1/test", (req, res) => {
  res.send("Working!");
});

// Get all to do list items
app.get("/v1/items", async (req, res) => {
  let status = 200;
  let err, data;
  const items = await getItems();
  res.jsonResponseFormat(status, err, items.rows);
});

// Create a todo item
app.post("/v1/items", async (req, res) => {
  const { title } = req.body;
  let status = 201;
  let err, data;

  if (!title) {
    status = 422;
    err = `Missing params`;
    res.jsonResponseFormat(status, err, data);
    return;
  }

  const item = new TodoItem({ title });
  await item.create().catch((e) => {
    status = 500;
    err = `Encountered an internal error when creating an item`;
  });

  res.jsonResponseFormat(status, err, item);
});

// Get a single todo item
app.get("/v1/items/:id", async (req, res) => {
  const id = req.params.id;
  let status = 200;
  let err, data;

  data = await new TodoItem({ id }).fetch().catch((e) => {
    status = 500;
    err = `Encountered an internal error when fetching item with ID '${id}'`;
  });

  res.jsonResponseFormat(status, err, data);
});

// Update a todo item
app.put("/v1/items/:id", async (req, res) => {
  const id = req.params.id;
  const { title, done } = req.body;
  let status = 200;
  let err, data;
  let changed = false;

  if (!title && typeof done !== "boolean") {
    status = 422;
    err = `Missing params`;
    res.jsonResponseFormat(status, err, data);
    return;
  }

  const item = await new TodoItem({ id }).fetch().catch((e) => {
    status = 500;
    err = `Encountered an internal error when fetching item with ID '${id}'`;
  });

  if (!err) {
    if (title) {
      item.setTitle(title);
      changed = true;
    }

    if (typeof done === "boolean") {
      item.setDone(done);
      changed = true;
    }

    if (changed) {
      await item.update().catch((e) => {
        status = 500;
        err = `Encountered an internal error when updating an item`;
      });
    }
  }

  res.jsonResponseFormat(status, err, item);
});

// Delete a todo item
app.delete("/v1/items/:id", async (req, res) => {
  const id = req.params.id;
  let status = 200;
  let err, data;

  item = await new TodoItem({ id }).delete().catch((e) => {
    status = 500;
    err = `Encountered an internal error when deleting an item`;
  });

  res.jsonResponseFormat(status, err, item);
});

// Server
const port = config.serverPort || 8080;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));
