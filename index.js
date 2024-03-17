import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Database init
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "database",
  password: "123456",
  port: 5432,
});

// Initialize express / port 3000
const app = express();
const port = 3000;

// Connection to db
db.connect();

let items = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Get request to render home page
app.get("/", async (req, res) => {
  try {
    const results = await db.query("select * from items order by id asc");
    items = results.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

// Post request to add new items
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("insert into items (title) values ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// Post request to update items
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("update items set title = ($1) where id = $2", [item, id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// Post request to delete items
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;

  try {
    await db.query("delete from items where id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
