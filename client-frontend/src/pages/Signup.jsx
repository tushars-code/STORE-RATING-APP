import { useState } from "react";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (form.name.length < 20 || form.name.length > 60) {
      tempErrors.name = "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      tempErrors.email = "Invalid email format.";
    }

    if (form.address.length > 400 || form.address.length < 5) {
      tempErrors.address = "Please enter a valid address (max 400 chars).";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      tempErrors.password = "8-16 chars, 1 uppercase, 1 special char.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await api.post("/auth/signup", { ...form, role: "USER" });
      alert("Signup successful! Redirecting to login...");
      window.location = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
        </div>

        <form onSubmit={submit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              className={errors.name ? 'error-border' : ''}
              placeholder="Min 20 characters required" 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email"
              className={errors.email ? 'error-border' : ''}
              placeholder="name@example.com" 
              onChange={e => setForm({ ...form, email: e.target.value })} 
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Address</label>
            <textarea 
              rows="2"
              className={errors.address ? 'error-border' : ''}
              placeholder="Your full delivery address" 
              onChange={e => setForm({ ...form, address: e.target.value })} 
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className={errors.password ? 'error-border' : ''}
              placeholder="••••••••" 
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f0f2f5;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .auth-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 450px;
        }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .auth-header h2 { margin: 0; color: #1a1a1a; font-size: 24px; }
        .auth-header p { color: #666; font-size: 14px; margin-top: 8px; }
        
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 6px; }
        .input-group input, .input-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border 0.3s;
        }
        .input-group input:focus { border-color: #3498db; outline: none; }
        
        .error-border { border-color: #e74c3c !important; }
        .error-text { color: #e74c3c; font-size: 11px; margin-top: 4px; display: block; }
        
        .auth-btn {
          width: 100%;
          padding: 14px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        .auth-btn:hover { background: #2980b9; }
        .auth-btn:disabled { background: #bdc3c7; cursor: not-allowed; }
        
        .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
        .auth-footer a { color: #3498db; text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
}