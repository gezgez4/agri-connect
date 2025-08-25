// src/components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

function Register() {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' // Default role
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Call register API
      const response = await userService.register(userData);

      setSuccess('Registration successful! Please login.');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header text-center">
            {/* Logo - Try to load from public folder, fallback to placeholder */}
            <img
              src="/logo.png"
              alt="AgriConnect Logo"
              style={{ height: '60px', marginBottom: '10px' }}
              onError={(e) => {
                // Fallback to placeholder if logo doesn't exist
                e.target.outerHTML = `
                  <div style="
                    width: 60px;
                    height: 60px;
                    background-color: #28a745;
                    border-radius: 50%;
                    margin: 0 auto 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                  ">🌱</div>
                `;
              }}
            />
            <h3>AgriConnect - Register</h3>
          </div>
          <div className="card-body">
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">I am a:</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="CLIENT">Client (I want to buy products)</option>
                  <option value="AGRICULTEUR">Farmer (I want to sell products)</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  minLength="6"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  minLength="6"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Registering...
                    </>
                  ) : (
                    '🌱 Register'
                  )}
                </button>
              </div>
            </form>

            {/* Link to Login */}
            <div className="text-center mt-3">
              <p>Already have an account?
                <Link to="/login" className="text-success fw-bold text-decoration-none ms-1">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;