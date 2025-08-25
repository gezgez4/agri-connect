// src/components/MyProducts.js
import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';

function MyProducts({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMyProducts();
  }, [user]);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsByOwner(user.id);
      setProducts(data);
    } catch (err) {
      setError('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    setDeleteLoading({ ...deleteLoading, [productId]: true });

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setMessage(`"${productName}" deleted successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading({ ...deleteLoading, [productId]: false });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>🌾 My Products</h2>
            <div>
              <span className="badge bg-success fs-6">
                {products.length} Product{products.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-box-seam" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted">No products yet</h4>
              <p className="text-muted mb-3">Start sharing your fresh products with customers!</p>
              <a href="/add-product" className="btn btn-success">
                🌱 Add Your First Product
              </a>
            </div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-success shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-success mb-0">
                          🥕 {product.nom}
                        </h5>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <p className="card-text text-muted">
                        {product.description}
                      </p>

                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="h5 text-success mb-1">
                              ${product.prix.toFixed(2)}
                            </div>
                            <small className="text-muted">Price</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="h5 text-primary mb-1">
                              {product.stock}
                            </div>
                            <small className="text-muted">Stock</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent">
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            // This would open an edit modal in a real app
                            alert('Edit functionality would open a modal/form here');
                          }}
                        >
                          ✏️ Edit Product
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(product.id, product.nom)}
                          disabled={deleteLoading[product.id]}
                        >
                          {deleteLoading[product.id] ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Deleting...
                            </>
                          ) : (
                            '🗑️ Delete Product'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title text-success">📊 Quick Stats</h6>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="h4 text-success">
                          {products.reduce((sum, p) => sum + p.stock, 0)}
                        </div>
                        <small className="text-muted">Total Items</small>
                      </div>
                      <div className="col-4">
                        <div className="h4 text-primary">
                          ${products.reduce((sum, p) => sum + (p.prix * p.stock), 0).toFixed(2)}
                        </div>
                        <small className="text-muted">Total Value</small>
                      </div>
                      <div className="col-4">
                        <div className="h4 text-info">
                          ${(products.reduce((sum, p) => sum + p.prix, 0) / products.length).toFixed(2)}
                        </div>
                        <small className="text-muted">Avg Price</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProducts;