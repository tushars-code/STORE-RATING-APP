import pool from "../config/db.js";

export const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  await pool.query(
    `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = ?
    `,
    [user_id, store_id, rating, rating]
  );

  res.json({ message: "Rating submitted" });
};
