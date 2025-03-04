import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../../src/Auth.css'

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const endpoint = isLogin ? "http://localhost:3808/api/auth/login" : "http://localhost:3808/api/auth/register";
      const { data } = await axios.post(endpoint, formData);
  
      if (isLogin) {
       
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        
        navigate('/');
      } else {
        alert("Signup successful!");
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404 && isLogin) {
          setError("User not found. Please create an account.");
        } else if (error.response.status === 401 && isLogin) {
          setError("Incorrect username or password.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2 className="auth-form-title">{isLogin ? "Login" : "Register"}</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="auth-input"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="auth-input"
            required
          />
          <button
            type="submit"
            className="auth-submit-btn"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="auth-toggle-text" onClick={toggleForm}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};


export default Auth;
