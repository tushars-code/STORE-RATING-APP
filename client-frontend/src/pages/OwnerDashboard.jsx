import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../auth";

export default function OwnerDashboard() {
  const [data, setData] = useState({ averageRating: 0, ratings: [], storeName: "" });
  const [sortConfig, setSortConfig] = useState({ key: 'rating', direction: 'desc' });
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/owner/dashboard");
      setData({
        averageRating: res.data.averageRating || 0,
        ratings: Array.isArray(res.data.ratings) ? res.data.ratings : [],
        storeName: res.data.storeName || ""
      });
    } catch (err) {
      setMessage("Store not assigned or data unavailable.");
      setIsError(true);
    }
  };
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedList = [...data.ratings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData({ ...data, ratings: sortedList });
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword) return alert("Please enter a new password");
    try {
      await api.put("/auth/password", { password: newPassword });
      setMessage("Password updated successfully!");
      setIsError(false);
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
      setIsError(true);
    }
  };

  return (
    <div className="container">
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Owner Dashboard {data.storeName && `- ${data.storeName}`}</h2>
        <button className="btn-danger" onClick={logout} style={{ width: 'auto' }}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{Number(data.averageRating).toFixed(2)}</span>
          <span className="stat-label">Average Store Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{data.ratings.length}</span>
          <span className="stat-label">Total User Reviews</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Customer Feedback</h3>
            {data.ratings.length > 0 && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleSort('customer_name')} className="btn-secondary" style={{ fontSize: '0.7rem' }}>
                  Sort Name {sortConfig.key === 'customer_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
                <button onClick={() => handleSort('rating')} className="btn-secondary" style={{ fontSize: '0.7rem' }}>
                  Sort Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
              </div>
            )}
          </div>

          <div className="review-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {data.ratings.length > 0 ? (
              data.ratings.map((r, i) => (
                <div key={i} className="data-row" style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <div className="info-group">
                    <strong style={{ display: 'block' }}>{r.customer_name}</strong>
                    <small style={{ color: '#666' }}>{r.name}</small>
                  </div>
                  <div className="overall-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 'bold', height: 'fit-content', padding: '5px 10px' }}>
                    {r.rating} / 5
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                No ratings have been submitted for your store yet.
              </p>
            )}
          </div>
        </div>
        <div className="card">
          <h3>Security Settings</h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
            Update your account password below.
          </p>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="New Secure Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button onClick={handlePasswordUpdate} style={{ width: '100%', marginTop: '15px' }}>Update Password</button>
            {message && (
              <p style={{ color: isError ? '#e74c3c' : '#27ae60', marginTop: '15px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}