package com.agriconnect.service;

import com.agriconnect.model.Order;
import com.agriconnect.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepo;

    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Order placeOrder(Order order) {
        // Set default status if not provided
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PENDING");
        }
        return orderRepo.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order findById(Long id) {
        Optional<Order> order = orderRepo.findById(id);
        return order.orElse(null);
    }

    public List<Order> getOrdersByClient(Long clientId) {
        return orderRepo.findByClientId(clientId);
    }

    public List<Order> getOrdersByProduct(Long productId) {
        return orderRepo.findByProductId(productId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepo.findByStatus(status);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optionalOrder = orderRepo.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepo.save(order);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepo.deleteById(id);
    }
}