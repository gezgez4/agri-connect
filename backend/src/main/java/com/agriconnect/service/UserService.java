package com.agriconnect.service;

import com.agriconnect.model.User;
import com.agriconnect.model.Role;
import com.agriconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        // Simple storage without password encryption
        user.setActive(true);
        return userRepository.save(user);
    }

    // Find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Find user by ID
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Find users by role (you'll need to add this method to UserRepository too)
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // Simple password check (plain text)
    public boolean checkPassword(String rawPassword, String storedPassword) {
        return rawPassword.equals(storedPassword);
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Update user
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // Check if user exists by ID
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

}