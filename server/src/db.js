// Config
const config = require("./config");

// Postgres client
const { Pool } = require("pg");

const pgClient = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort,
});

pgClient.on("error", () => console.log("Lost Postgres connection"));

// CRUD

const getItems = () => pgClient.query("SELECT * FROM items ORDER BY sort ASC");

const getItem = ({ id }) =>
  pgClient.query("SELECT * FROM items WHERE id = $1", [id]).then(result => result.rows[0]);

const createItem = ({ id, title }) =>
  pgClient.query(
    `INSERT INTO items (id, title, done, sort) VALUES ($1, $2, DEFAULT, DEFAULT)`,
    [id, title]
  );

const updateItem = ({ title, done, id }) =>
  pgClient.query(
    `UPDATE items SET title = $1, done = $2 WHERE id = $3`,
    [title, done, id]
  );

const deleteItem = ({ id }) =>
  pgClient.query("DELETE FROM items WHERE id = $1", [id]);

// Active-record model decorator

const decorateModelCRUD = (Model) => {
  Model.prototype.create = async function entity_create() {
    return createItem(this);
  };
  Model.prototype.fetch = async function entity_read() {
    const {id, title, done} = await getItem(this);
    this.id = id
    this.title = title
    this.done = done
    return this
  };
  Model.prototype.update = async function entity_update() {
    await updateItem(this);
    return this
  };
  Model.prototype.delete = async function entity_delete() {
    await deleteItem(this);
    return this
  };
};

module.exports = {
  client: pgClient,
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  decorateModelCRUD,
};
