// src/components/MyOrders.js
import React, { useState, useEffect } from 'react';
import { orderService, productService } from '../services/api';

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // Load orders based on user role
      let orderData;
      if (user.role === 'CLIENT') {
        orderData = await orderService.getOrdersByClient(user.id);
      } else {
        // For farmers, get orders for their products
        const userProducts = await productService.getProductsByOwner(user.id);
        const allOrders = [];

        for (const product of userProducts) {
          const productOrders = await orderService.getOrdersByProduct(product.id);
          allOrders.push(...productOrders);
        }
        orderData = allOrders;
      }

      setOrders(orderData);

      // Load product details for orders
      const productIds = [...new Set(orderData.map(order => order.productId))];
      const allProducts = await productService.getAllProducts();
      const productMap = {};

      allProducts.forEach(product => {
        if (productIds.includes(product.id)) {
          productMap[product.id] = product;
        }
      });

      setProducts(productMap);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'SHIPPED': 'bg-primary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    return statusMap[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            {user.role === 'CLIENT' ? '🛒 My Orders' : '📦 Orders Received'}
          </h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">
                {user.role === 'CLIENT' ? 'No orders placed yet' : 'No orders received yet'}
              </h4>
              <p className="text-muted">
                {user.role === 'CLIENT'
                  ? 'Browse products to place your first order!'
                  : 'Orders will appear here when customers buy your products.'
                }
              </p>
            </div>
          ) : (
            <div className="row">
              {orders.map((order) => {
                const product = products[order.productId];
                return (
                  <div key={order.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title text-success">
                            Order #{order.id}
                          </h6>
                          <span className={`badge ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        {product && (
                          <>
                            <h5 className="mb-2">{product.nom}</h5>
                            <p className="text-muted small mb-2">
                              {product.description}
                            </p>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Quantity: <strong>{order.quantity}</strong></span>
                              <span>Price: <strong>${product.prix.toFixed(2)}</strong></span>
                            </div>
                            <div className="border-top pt-2">
                              <strong>Total: ${(product.prix * order.quantity).toFixed(2)}</strong>
                            </div>
                          </>
                        )}

                        {!product && (
                          <p className="text-muted">Product information loading...</p>
                        )}
                      </div>

                      <div className="card-footer bg-transparent">
                        {user.role === 'AGRICULTEUR' && order.status === 'PENDING' && (
                          <div className="d-grid gap-2 d-md-flex">
                            <button className="btn btn-success btn-sm flex-fill">
                              ✅ Confirm
                            </button>
                            <button className="btn btn-outline-danger btn-sm flex-fill">
                              ❌ Cancel
                            </button>
                          </div>
                        )}

                        {user.role === 'CLIENT' && (
                          <small className="text-muted">
                            {order.status === 'PENDING' ? 'Waiting for farmer confirmation' :
                             order.status === 'CONFIRMED' ? 'Order confirmed, preparing for shipment' :
                             order.status === 'SHIPPED' ? 'Order shipped' :
                             order.status === 'DELIVERED' ? 'Order delivered' :
                             'Order cancelled'}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;