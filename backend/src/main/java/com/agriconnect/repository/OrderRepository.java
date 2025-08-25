package com.agriconnect.repository;

import com.agriconnect.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByClientId(Long clientId);

    List<Order> findByProductId(Long productId);

    List<Order> findByStatus(String status);
}