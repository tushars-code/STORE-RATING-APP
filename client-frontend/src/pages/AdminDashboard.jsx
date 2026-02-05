import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../auth";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilter, setUserFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", owner_id: "" });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    api.get("/admin/dashboard").then(res => setStats(res.data));
    api.get("/admin/users").then(res => setUsers(res.data));
    api.get("/admin/stores").then(res => setStores(res.data));
  };

  const handleAddUser = async () => {
    try { 
      await api.post("/admin/users", newUser); 
      alert("User Added Successfully"); 
      refreshData(); 
    } catch(e) { 
      alert(e.response?.data?.message || "Failed to add user"); 
    }
  };

  const handleAddStore = async () => {
    try { 
      await api.post("/admin/stores", newStore); 
      alert("Store Added Successfully"); 
      refreshData(); 
    } catch(e) { 
      alert("Failed to add store"); 
    }
  };

  const filteredUsers = users
    .filter(u => 
      u.name.toLowerCase().includes(userFilter.toLowerCase()) || 
      u.email.toLowerCase().includes(userFilter.toLowerCase()) ||
      u.address?.toLowerCase().includes(userFilter.toLowerCase()) ||
      u.role.toLowerCase().includes(userFilter.toLowerCase())
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  const filteredStores = stores
    .filter(s => 
      s.name.toLowerCase().includes(storeFilter.toLowerCase()) || 
      s.address?.toLowerCase().includes(storeFilter.toLowerCase())
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  return (
    <div className="container">
      <h2>System Administrator Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{stats.totalUsers}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.totalStores}</span>
          <span className="stat-label">Total Stores</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.totalRatings}</span>
          <span className="stat-label">Total Ratings</span>
        </div>
      </div>
      <div className="card">
        <h3>Add New User</h3>
        <div className="grid-2">
          <input placeholder="Name" onChange={e => setNewUser({...newUser, name: e.target.value})} />
          <input placeholder="Email" onChange={e => setNewUser({...newUser, email: e.target.value})} />
          <input placeholder="Password" type="password" onChange={e => setNewUser({...newUser, password: e.target.value})} />
          <input placeholder="Address" onChange={e => setNewUser({...newUser, address: e.target.value})} />
          <select onChange={e => setNewUser({...newUser, role: e.target.value})}>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">System Admin</option>
          </select>
          <button onClick={handleAddUser}>Create User</button>
        </div>
      </div>
      <div className="card">
        <h3>Add New Store</h3>
        <div className="grid-2">
          <input placeholder="Store Name" onChange={e => setNewStore({...newStore, name: e.target.value})} />
          <input placeholder="Store Email" onChange={e => setNewStore({...newStore, email: e.target.value})} />
          <input placeholder="Store Address" onChange={e => setNewStore({...newStore, address: e.target.value})} />
          <input placeholder="Owner User ID" onChange={e => setNewStore({...newStore, owner_id: e.target.value})} />
          <button onClick={handleAddStore}>Create Store</button>
        </div>
      </div>
      <div className="card">
        <h3>Manage Users</h3>
        <div className="grid-2" style={{marginBottom: '20px'}}>
          <input placeholder="Search Name, Email, Address, or Role..." value={userFilter} onChange={e => setUserFilter(e.target.value)} />
          <select onChange={e => setSortBy(e.target.value)}>
            <option value="name">Sort by Name (Asc)</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>
        </div>

        {filteredUsers.map(user => (
          <div key={user.id} className="data-row">
            <div className="info-group">
              <b>{user.name}</b>
              <span>{user.email} | {user.role}</span>
              <p style={{fontSize: '0.8rem', color: '#666'}}>{user.address}</p>
            </div>
            {user.role === 'STORE_OWNER' && (
              <div className="overall-badge">Rating: {user.rating || '0.0'}</div>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Registered Stores</h3>
        <input placeholder="Search Store Name or Address..." value={storeFilter} onChange={e => setStoreFilter(e.target.value)} />
        
        {filteredStores.map(store => (
          <div key={store.id} className="data-row">
            <div className="info-group">
              <b>{store.name}</b>
              <span>{store.address}</span>
            </div>
            <div className="overall-badge">Avg Rating: {store.rating || 'N/A'}</div>
          </div>
        ))}
      </div>

      <button className="btn-danger" onClick={logout} style={{marginBottom: '50px'}}>Logout</button>
    </div>
  );
}