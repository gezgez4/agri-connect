package com.agriconnect.repository;

import com.agriconnect.model.User;
import com.agriconnect.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users by role
    List<User> findByRole(Role role);

    // Check if email exists
    boolean existsByEmail(String email);
    List<User> findByActiveTrue();

    List<User> findByActiveFalse();
}