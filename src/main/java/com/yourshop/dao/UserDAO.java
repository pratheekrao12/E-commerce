package com.yourshop.dao;

import com.yourshop.config.DBConfig;
import com.yourshop.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    public boolean register(String email, String plainPassword) throws SQLException {
        String sql = "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'USER')";
        String hashed = BCrypt.hashpw(plainPassword, BCrypt.gensalt(12));

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email.trim().toLowerCase());
            stmt.setString(2, hashed);
            return stmt.executeUpdate() == 1;
        }
    }

    public User authenticate(String email, String plainPassword) throws SQLException {
        String sql = "SELECT id, email, password_hash, role FROM users WHERE email = ?";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email.trim().toLowerCase());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password_hash");
                    if (BCrypt.checkpw(plainPassword, storedHash)) {
                        return new User(
                            rs.getInt("id"),
                            rs.getString("email"),
                            rs.getString("role")
                        );
                    }
                }
            }
        }
        return null;
    }
}