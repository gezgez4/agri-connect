package com.agriconnect.controller;

import com.agriconnect.model.User;
import com.agriconnect.model.Role;
import com.agriconnect.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users endpoint
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            if (user != null) {
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userData) {
        try {
            User user = new User();
            user.setNom(userData.get("name"));
            user.setEmail(userData.get("email"));
            user.setMotDePasse(userData.get("password"));
            user.setRole(Role.valueOf(userData.get("role")));

            User savedUser = userService.registerUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            User user = userService.findByEmail(email);

            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(401).body(error);
            }

            boolean passwordMatch = userService.checkPassword(password, user.getMotDePasse());

            if (!passwordMatch) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid password");
                return ResponseEntity.status(401).body(error);
            }

            if (!user.isActive()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Account not activated");
                return ResponseEntity.status(403).body(error);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.getId());
            response.put("name", user.getNom());
            response.put("role", user.getRole().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Delete user endpoint - MOVED INSIDE THE CLASS
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Check if user exists
            if (!userService.existsById(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found with id: " + id);
                return ResponseEntity.notFound().build();
            }

            userService.deleteUser(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            response.put("deletedUserId", id.toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Update user endpoint
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userData) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found with id: " + id);
                return ResponseEntity.notFound().build();
            }

            // Update fields if provided
            if (userData.get("name") != null) {
                user.setNom(userData.get("name"));
            }
            if (userData.get("email") != null) {
                user.setEmail(userData.get("email"));
            }
            if (userData.get("password") != null) {
                user.setMotDePasse(userData.get("password"));
            }
            if (userData.get("role") != null) {
                user.setRole(Role.valueOf(userData.get("role")));
            }

            User updatedUser = userService.updateUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
            response.put("userId", updatedUser.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        try {
            List<User> users = userService.findByRole(role);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Users API is working!");
        response.put("endpoints", "GET /, GET /{id}, POST /register, POST /login, DELETE /{id}, PUT /{id}, GET /role/{role}");
        return ResponseEntity.ok(response);
    }
}