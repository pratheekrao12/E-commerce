package com.yourshop.controller;

import com.yourshop.dao.ProductDAO;
import com.yourshop.model.Product;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {
    private final ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idParam = req.getParameter("id");

        try {
            if (idParam != null && !idParam.isBlank()) {
                int id = Integer.parseInt(idParam);
                Product product = productDAO.findById(id);
                if (product == null) {
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found");
                    return;
                }
                req.setAttribute("product", product);
                req.getRequestDispatcher("/WEB-INF/views/public/product-detail.jsp").forward(req, resp);
            } else {
                req.setAttribute("products", productDAO.findAll());
                req.getRequestDispatcher("/WEB-INF/views/public/products.jsp").forward(req, resp);
            }
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid product ID");
        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error");
        }
    }
}