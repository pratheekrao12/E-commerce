package com.yourshop.dao;

import com.yourshop.config.DBConfig;
import com.yourshop.model.Product;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public List<Product> findAll() throws SQLException {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT id, name, description, price, stock, image_url FROM products ORDER BY id DESC";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public Product findById(int id) throws SQLException {
        String sql = "SELECT id, name, description, price, stock, image_url FROM products WHERE id = ?";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        }
        return null;
    }

    public void create(String name, String description, BigDecimal price, int stock, String imageUrl) throws SQLException {
        String sql = "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name.trim());
            stmt.setString(2, description == null ? "" : description.trim());
            stmt.setBigDecimal(3, price);
            stmt.setInt(4, stock);
            stmt.setString(5, imageUrl == null ? "" : imageUrl.trim());
            stmt.executeUpdate();
        }
    }

    public void update(int id, String name, String description, BigDecimal price, int stock, String imageUrl) throws SQLException {
        String sql = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name.trim());
            stmt.setString(2, description == null ? "" : description.trim());
            stmt.setBigDecimal(3, price);
            stmt.setInt(4, stock);
            stmt.setString(5, imageUrl == null ? "" : imageUrl.trim());
            stmt.setInt(6, id);
            stmt.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM products WHERE id = ?";

        try (Connection conn = DBConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Product mapRow(ResultSet rs) throws SQLException {
        return new Product(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("description"),
            rs.getBigDecimal("price"),
            rs.getInt("stock"),
            rs.getString("image_url")
        );
    }
}