const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bibliotheque"
});

// API pour inscription
app.post("/api/admin/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO admins (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Compte administrateu créé avec succès !" });
    }
  );
});

// API pour connexion
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ message: "Email non trouvé" });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) return res.status(401).json({ message: "Mot de passe incorrect" });

    res.json({ message: "Connexion réussie !" });
  });
});

app.listen(3001, () => {
  console.log("Backend démarré sur http://localhost:3001");
});