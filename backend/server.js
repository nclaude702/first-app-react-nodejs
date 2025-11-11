const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection (use environment variables)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "signup",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// POST /signup route
app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error inserting data" });
    }
    res.status(200).json({ message: "Signup successful", data: result });
  });
});

// POST /login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE email=? AND password=?";
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Login error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Email or password wrong" });
    }
    res.status(200).json({ message: "Login successful", data: result });
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /signup or /login.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
