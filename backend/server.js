const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Needed to parse JSON from frontend

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
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

app.post("/login", (req, res) => {
    const {email,password}=req.body
  const sql = "SELECT * FROM login WHERE email=? AND password=?";
  const values = [email,password];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "login error" });
    }
    if(result.length==0){
        return res.status(404).json({message:"email or password wrong"})
    }
    res.status(200).json({ message: "Login", data: result });
  });
});

// Optional GET route for testing
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /signup to register.");
});

app.listen(8081, () => {
  console.log("Server running on http://localhost:8081");
});
