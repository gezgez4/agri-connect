package com.agriconnect.controller;

import com.agriconnect.model.Product;
import com.agriconnect.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add product
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> productData) {
        try {
            Product product = new Product();
            product.setNom((String) productData.get("name"));
            product.setDescription((String) productData.get("description"));
            product.setPrix(Double.parseDouble(productData.get("price").toString()));
            product.setStock(Integer.parseInt(productData.get("stock").toString()));
            product.setOwnerId(Long.parseLong(productData.get("ownerId").toString()));

            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to add product: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all products
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get products by owner
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Product>> getByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(productService.getProductsByOwner(ownerId));
    }

    // Delete product
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete product: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}