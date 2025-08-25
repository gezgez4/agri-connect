package com.agriconnect.repository;


import com.agriconnect.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByOwnerId(Long ownerId);
}


