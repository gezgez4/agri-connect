// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';

function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState({});
  const [orderMessage, setOrderMessage] = useState('');

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (productId, productName) => {
    if (user.role !== 'CLIENT') {
      setOrderMessage('Only clients can place orders');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    setOrderLoading({ ...orderLoading, [productId]: true });

    try {
      const orderData = {
        productId: productId,
        clientId: user.id,
        quantity: 1 // Default quantity
      };

      await orderService.placeOrder(orderData);
      setOrderMessage(`Order placed for ${productName} successfully!`);

      // Clear message after 3 seconds
      setTimeout(() => setOrderMessage(''), 3000);
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
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">🌾 Fresh Products</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {orderMessage && (
            <div className="alert alert-info" role="alert">
              {orderMessage}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">No products available</h4>
              <p className="text-muted">Check back later for fresh products!</p>
            </div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card h-100 border-success shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-success">
                        🥕 {product.nom}
                      </h5>
                      <p className="card-text text-muted">
                        {product.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-success mb-0">
                          ${product.prix.toFixed(2)}
                        </span>
                        <span className="badge bg-light text-dark">
                          Stock: {product.stock}
                        </span>
                      </div>

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
                            '🛒 Order Now'
                          )}
                        </button>
                      )}

                      {user.role === 'AGRICULTEUR' && product.ownerId === user.id && (
                        <div className="mt-2">
                          <small className="text-muted">✅ Your Product</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;