import pool from "../config/db.js";
import bcrypt from "bcrypt";


export const dashboard = async (_, res) => {
  try {
    const [[users]] = await pool.query("SELECT COUNT(*) total FROM users");
    const [[stores]] = await pool.query("SELECT COUNT(*) total FROM stores");
    const [[ratings]] = await pool.query("SELECT COUNT(*) total FROM ratings");

    res.json({
      totalUsers: users.total,
      totalStores: stores.total,
      totalRatings: ratings.total,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.role, u.address,
        (
          SELECT ROUND(AVG(r.rating), 2)
          FROM stores s
          JOIN ratings r ON s.id = r.store_id
          WHERE s.owner_id = u.id
        ) AS rating
      FROM users u
      ORDER BY u.id DESC
    `;
    const [users] = await pool.query(query);
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


export const getAllStores = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id,
        ROUND(AVG(r.rating), 2) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.id DESC
    `;
    const [stores] = await pool.query(query);
    res.json(stores);
  } catch (err) {
    console.error("Get Stores Error:", err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};



export const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, Email, Password, and Role are required." });
  }

  try {
 
    const [[existing]] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hash, address || null, role]
    );

    res.json({ message: "User added successfully" });
  } catch (err) {
   
    console.error("CRITICAL DATABASE ERROR (addUser):", err);

    if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ message: "Input too long (Check Name or Address limits)." });
    }

    res.status(500).json({ message: `Internal Server Error: ${err.sqlMessage || 'Unknown error'}` });
  }
};


export const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !owner_id) {
    return res.status(400).json({ message: "Store Name, Email, and Owner ID are required." });
  }

  try {
    await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address || null, owner_id]
    );
    res.json({ message: "Store added successfully" });
  } catch (err) {
    console.error("CRITICAL DATABASE ERROR (addStore):", err);
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: "Invalid Owner ID. This user does not exist." });
    }

    res.status(500).json({ message: `Internal Server Error: ${err.sqlMessage || 'Unknown error'}` });
  }
};