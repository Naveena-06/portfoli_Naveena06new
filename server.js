const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve frontend (IMPORTANT)
app.use(express.static("public"));

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "contact_db"
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("DB connected");
  }
});

// ✅ Home route (open index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ POST route (form submit)
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error saving data");
    } else {
      // ✅ Success alert + redirect
      res.send(`
        <script>
          alert("Message sent successfully!");
          window.location.href = "http://localhost:3000/";
        </script>
      `);
    }
  });
});

// ✅ Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});