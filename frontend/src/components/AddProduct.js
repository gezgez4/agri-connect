// src/components/AddProduct.js
import React, { useState } from 'react';
import { productService } from '../services/api';

function AddProduct({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        ownerId: user.id
      };

      await productService.addProduct(productData);
      setMessage('Product added successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h3 className="mb-1">🌱 Add New Product</h3>
              <small>Share your fresh products with customers</small>
            </div>
            <div className="card-body">
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control border-success"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Fresh Tomatoes, Organic Carrots"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control border-success"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control border-success"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="stock" className="form-label">Quantity Available</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control border-success"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        placeholder="How many units?"
                      />
                    </div>
                  </div>
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
                        Adding Product...
                      </>
                    ) : (
                      '🌱 Add Product'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-light rounded border border-success">
                <h6 className="text-success">💡 Tips for better sales:</h6>
                <ul className="mb-0 small">
                  <li>Use clear, descriptive product names</li>
                  <li>Mention if products are organic, locally grown, etc.</li>
                  <li>Set competitive prices</li>
                  <li>Keep stock numbers updated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;