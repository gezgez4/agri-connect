// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';

function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [productId]: quantity
    });
  };

  const handleOrder = async (productId, productName) => {
    if (user.role !== 'CLIENT') {
      setOrderMessage('Only clients can place orders');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    const quantity = selectedQuantities[productId] || 1;
    setOrderLoading({ ...orderLoading, [productId]: true });

    try {
      const orderData = {
        productId: productId,
        clientId: user.id,
        quantity: quantity
      };

      await orderService.placeOrder(orderData);
      setOrderMessage(`Order placed for ${quantity}x ${productName} successfully!`);

      // Clear message after 3 seconds
      setTimeout(() => setOrderMessage(''), 3000);

      // Reset quantity selection
      setSelectedQuantities({
        ...selectedQuantities,
        [productId]: 1
      });
    } catch (err) {
      setOrderMessage('Failed to place order');
      setTimeout(() => setOrderMessage(''), 3000);
    } finally {
      setOrderLoading({ ...orderLoading, [productId]: false });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading fresh products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {/* Header with search */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">🌾 Fresh Products</h2>
            <div className="d-flex align-items-center">
              <span className="badge bg-success fs-6 me-3">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              {user.role === 'AGRICULTEUR' && (
                <a href="/add-product" className="btn btn-success">
                  ➕ Add Product
                </a>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-success text-white">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {orderMessage && (
            <div className="alert alert-info alert-dismissible fade show" role="alert">
              {orderMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setOrderMessage('')}
              ></button>
            </div>
          )}

          {filteredProducts.length === 0 && !loading ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-search" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted">
                {searchTerm ? 'No products found' : 'No products available'}
              </h4>
              <p className="text-muted">
                {searchTerm
                  ? `No products match "${searchTerm}". Try a different search term.`
                  : 'Check back later for fresh products!'
                }
              </p>
              {searchTerm && (
                <button
                  className="btn btn-outline-success"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-success shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-success mb-0">
                          🥕 {product.nom}
                        </h5>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                        </span>
                      </div>

                      <p className="card-text text-muted mb-3">
                        {product.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5 text-success mb-0">
                          ${product.prix.toFixed(2)}
                        </span>
                        {user.role === 'AGRICULTEUR' && product.ownerId === user.id && (
                          <span className="badge bg-info">Your Product</span>
                        )}
                      </div>

                      {user.role === 'CLIENT' && product.stock > 0 && (
                        <div className="mb-3">
                          <label className="form-label small">Quantity:</label>
                          <select
                            className="form-select form-select-sm"
                            value={selectedQuantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                          >
                            {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="card-footer bg-transparent">
                      {user.role === 'CLIENT' && (
                        <button
                          className="btn btn-success w-100"
                          onClick={() => handleOrder(product.id, product.nom)}
                          disabled={orderLoading[product.id] || product.stock === 0}
                        >
                          {orderLoading[product.id] ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Ordering...
                            </>
                          ) : product.stock === 0 ? (
                            '❌ Out of Stock'
                          ) : (
                            `🛒 Order ${selectedQuantities[product.id] || 1}x - ${((selectedQuantities[product.id] || 1) * product.prix).toFixed(2)}`
                          )}
                        </button>
                      )}

                      {user.role === 'AGRICULTEUR' && product.ownerId !== user.id && (
                        <div className="text-center">
                          <small className="text-muted">👨‍🌾 Sold by another farmer</small>
                        </div>
                      )}

                      {user.role === 'AGRICULTEUR' && product.ownerId === user.id && (
                        <div className="d-grid gap-2">
                          <a href="/my-products" className="btn btn-outline-primary btn-sm">
                            ✏️ Manage This Product
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {filteredProducts.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card bg-light border-success">
                  <div className="card-body">
                    <h6 className="card-title text-success mb-3">📊 Marketplace Stats</h6>
                    <div className="row text-center">
                      <div className="col-md-3 col-6 mb-2">
                        <div className="h4 text-success">
                          {filteredProducts.length}
                        </div>
                        <small className="text-muted">Products</small>
                      </div>
                      <div className="col-md-3 col-6 mb-2">
                        <div className="h4 text-primary">
                          {filteredProducts.filter(p => p.stock > 0).length}
                        </div>
                        <small className="text-muted">Available</small>
                      </div>
                      <div className="col-md-3 col-6 mb-2">
                        <div className="h4 text-info">
                          ${filteredProducts.length > 0 ?
                            (filteredProducts.reduce((sum, p) => sum + p.prix, 0) / filteredProducts.length).toFixed(2) :
                            '0.00'
                          }
                        </div>
                        <small className="text-muted">Avg Price</small>
                      </div>
                      <div className="col-md-3 col-6 mb-2">
                        <div className="h4 text-warning">
                          {filteredProducts.reduce((sum, p) => sum + p.stock, 0)}
                        </div>
                        <small className="text-muted">Total Stock</small>
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

export default ProductList;