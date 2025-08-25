package com.agriconnect.service;

import com.agriconnect.model.Product;
import com.agriconnect.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepo;

    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public List<Product> getProductsByOwner(Long ownerId) {
        return productRepo.findByOwnerId(ownerId);
    }

    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }
}