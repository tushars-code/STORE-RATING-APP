import pool from "../config/db.js";

export const ownerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [[storeInfo]] = await pool.query(
      `
      SELECT s.name AS storeName, ROUND(AVG(r.rating), 2) AS avgRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY s.id
      `,
      [ownerId]
    );

    const [ratings] = await pool.query(
      `
      SELECT u.name, u.email, r.rating, r.created_at
      FROM stores s
      JOIN ratings r ON s.id = r.store_id
      JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = ?
      `,
      [ownerId]
    );

    res.json({
      storeName: storeInfo?.storeName || "My Store",
      averageRating: storeInfo?.avgRating || "0.00",
      ratings: ratings || []
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};