package com.yourshop.controller;

import com.yourshop.dao.ProductDAO;
import com.yourshop.model.Product;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;

@WebServlet(urlPatterns = {"/admin/dashboard", "/admin/products/form", "/admin/products/save", "/admin/products/delete"})
public class AdminProductServlet extends HttpServlet {
    private final ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        try {
            if ("/admin/products/form".equals(path)) {
                String idParam = req.getParameter("id");
                if (idParam != null && !idParam.isBlank()) {
                    Product existing = productDAO.findById(Integer.parseInt(idParam));
                    req.setAttribute("product", existing);
                }
                req.getRequestDispatcher("/WEB-INF/views/admin/product-form.jsp").forward(req, resp);
            } else {
                req.setAttribute("products", productDAO.findAll());
                req.getRequestDispatcher("/WEB-INF/views/admin/dashboard.jsp").forward(req, resp);
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error loading admin view");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();

        try {
            if ("/admin/products/delete".equals(path)) {
                int id = Integer.parseInt(req.getParameter("id"));
                productDAO.delete(id);
                resp.sendRedirect(req.getContextPath() + "/admin/dashboard");
                return;
            }

            if ("/admin/products/save".equals(path)) {
                String idParam = req.getParameter("id");
                String name = req.getParameter("name");
                String description = req.getParameter("description");
                BigDecimal price = new BigDecimal(req.getParameter("price"));
                int stock = Integer.parseInt(req.getParameter("stock"));
                String imageUrl = req.getParameter("imageUrl");

                if (name == null || name.isBlank() || price.compareTo(BigDecimal.ZERO) < 0 || stock < 0) {
                    req.setAttribute("error", "Valid name, non-negative price, and non-negative stock are required.");
                    req.getRequestDispatcher("/WEB-INF/views/admin/product-form.jsp").forward(req, resp);
                    return;
                }

                if (idParam != null && !idParam.isBlank()) {
                    productDAO.update(Integer.parseInt(idParam), name, description, price, stock, imageUrl);
                } else {
                    productDAO.create(name, description, price, stock, imageUrl);
                }
                resp.sendRedirect(req.getContextPath() + "/admin/dashboard");
            }
        } catch (NumberFormatException e) {
            req.setAttribute("error", "Price and stock must be valid numbers.");
            req.getRequestDispatcher("/WEB-INF/views/admin/product-form.jsp").forward(req, resp);
        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error");
        }
    }
}