import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateUser } from "../utils/validation.util.js";

export const signup = async (req, res) => {
  const error = validateUser(req.body);
  if (error) return res.status(400).json({ message: error });

  const { name, email, password, address } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)",
      [name, email, hash, address, "USER"]
    );
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Email already exists" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [[user]] = await pool.query("SELECT * FROM users WHERE email=?", [email]);

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

export const updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id; 

  if (!password) return res.status(400).json({ message: "Password is required" });
  const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
  if (!passRegex.test(password)) {
    return res.status(400).json({ 
      message: "Password must be 8-16 characters, include 1 uppercase letter and 1 special character." 
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hash, userId]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password in database" });
  }
};