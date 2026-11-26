package com.yourshop.model;

import java.math.BigDecimal;

public class CartItem {
    private int id;
    private int productId;
    private String productName;
    private BigDecimal price;
    private int quantity;

    public CartItem(int id, int productId, String productName, BigDecimal price, int quantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public int getId() { return id; }
    public int getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public BigDecimal getSubtotal() { return price.multiply(BigDecimal.valueOf(quantity)); }
}