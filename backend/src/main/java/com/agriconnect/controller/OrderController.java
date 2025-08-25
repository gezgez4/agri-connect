package com.agriconnect.controller;

import com.agriconnect.model.Order;
import com.agriconnect.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place an order
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Order order = new Order();
            // FIXED: Use instance methods, not static methods
            order.setProductId(Long.parseLong(orderData.get("productId").toString()));
            order.setClientId(Long.parseLong(orderData.get("clientId").toString()));
            order.setQuantity(Integer.parseInt(orderData.get("quantity").toString()));

            Order savedOrder = orderService.placeOrder(order);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order placed successfully");
            response.put("orderId", savedOrder.getId());
            response.put("order", savedOrder);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to place order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.findById(id);
            if (order != null) {
                return ResponseEntity.ok(order);
            }
            Map<String, String> error = new HashMap<>();
            error.put("message", "Order not found");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error retrieving order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get orders by client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Order>> getByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(orderService.getOrdersByClient(clientId));
    }

    // Get orders by product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Order>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(orderService.getOrdersByProduct(productId));
    }

    // Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Orders API is working!");
        response.put("endpoints", "GET /, POST /place, GET /{id}, GET /client/{clientId}, GET /product/{productId}, DELETE /{id}");
        return ResponseEntity.ok(response);
    }
}