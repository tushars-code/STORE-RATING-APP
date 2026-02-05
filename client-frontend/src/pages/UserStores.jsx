import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../auth";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
   
      const res = await api.get("/stores");
      setStores(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Session expired"); 
      logout();
    } finally {
      setLoading(false);
    }
  };

  const rateStore = async (storeId, rating) => {
    try {
    
      await api.post("/ratings", { store_id: storeId, rating });
      setStores(prev => prev.map(s => 
        s.id === storeId ? { ...s, userRating: rating } : s
      ));
    } catch { 
      alert("Rating submission failed. Please try again."); 
    }
  };

  const changePassword = async () => {
    if (!newPass) return alert("Enter a new password");
    try {

      await api.put("/auth/password", { password: newPass });
      setPassMsg("Password updated successfully!");
      setNewPass("");
    } catch(err) { 
      setPassMsg(err.response?.data?.message || "Update failed"); 
    }
  };

  const filtered = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.address || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container"><p>Loading store data...</p></div>;

  return (
    <div className="container">
      <div className="header-flex">
        <h2>Consumer Portal</h2>
        <button className="btn-danger" onClick={logout} style={{width:'auto'}}>Logout</button>
      </div>
      <div className="card">
        <h3>My Profile Settings</h3>
        <div className="grid-2">
          <input 
            type="password" 
            placeholder="New Secure Password" 
            value={newPass} 
            onChange={e => setNewPass(e.target.value)} 
          />
          <button onClick={changePassword}>Change Password</button>
        </div>
        {passMsg && <p style={{color: passMsg.includes("success") ? 'green' : 'red', fontSize: '0.8rem', marginTop: '10px'}}>{passMsg}</p>}
      </div>
    
      <div className="card">
        <h3>Registered Stores</h3>
        <input 
          className="search-input"
          placeholder="Search by Store Name or Address..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        
        <div className="store-grid">
          {filtered.map(store => (
            <div key={store.id} className="data-row" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                <div>
                  <h4 style={{margin:0}}>{store.name}</h4>
                  <p style={{fontSize: '0.85rem', color: '#666', margin: '5px 0'}}>{store.address}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div className="overall-badge">Avg: {store.overallRating || "N/A"}</div>
                  <p style={{fontSize: '0.75rem', marginTop: '5px'}}>
                    Your Rating: <b>{store.userRating || "None"}</b>
                  </p>
                </div>
              </div>

              <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '0.8rem'}}>Rate this store:</span>
                {[1, 2, 3, 4, 5].map(r => (
                  <button 
                    key={r} 
                    onClick={() => rateStore(store.id, r)}
                    style={{
                      width: '35px', 
                      height: '35px',
                      padding: 0,
                      borderRadius: '50%',
                      background: store.userRating === r ? '#f59e0b' : '#eee',
                      color: store.userRating === r ? 'white' : '#333',
                      border: '1px solid #ccc'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-muted">No stores found matching your search.</p>}
      </div>
    </div>
  );
}