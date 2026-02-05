import pool from "../config/db.js";

export const listStores = async (req, res) => {
  const userId = req.user.id;

  const [stores] = await pool.query(
    `
    SELECT 
      s.id,
      s.name,
      s.address,
      ROUND(AVG(r.rating),2) AS overallRating,
      ur.rating AS userRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    LEFT JOIN ratings ur 
      ON ur.store_id = s.id AND ur.user_id = ?
    GROUP BY s.id
    `,
    [userId]
  );

  res.json(stores);
};
