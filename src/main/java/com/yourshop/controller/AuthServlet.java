package com.yourshop.controller;

import com.yourshop.dao.UserDAO;
import com.yourshop.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;

@WebServlet(urlPatterns = {"/login", "/register", "/logout"})
public class AuthServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        if ("/logout".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session != null) session.invalidate();
            resp.sendRedirect(req.getContextPath() + "/login");
            return;
        }
        String view = "/register".equals(path) ? "/WEB-INF/views/public/register.jsp" : "/WEB-INF/views/public/login.jsp";
        req.getRequestDispatcher(view).forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        String email = req.getParameter("email");
        String password = req.getParameter("password");

        if (email == null || email.isBlank() || password == null || password.length() < 8) {
            req.setAttribute("error", "Valid email and password (8+ characters) are required.");
            doGet(req, resp);
            return;
        }

        try {
            if ("/register".equals(path)) {
                userDAO.register(email, password);
                resp.sendRedirect(req.getContextPath() + "/login?registered=true");
            } else if ("/login".equals(path)) {
                User user = userDAO.authenticate(email, password);
                if (user != null) {
                    HttpSession session = req.getSession(true);
                    req.changeSessionId(); // Prevents session fixation
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("userEmail", user.getEmail());
                    session.setAttribute("userRole", user.getRole());

                    String target = "ADMIN".equals(user.getRole()) ? "/admin/dashboard" : "/products";
                    resp.sendRedirect(req.getContextPath() + target);
                } else {
                    req.setAttribute("error", "Invalid email or password.");
                    doGet(req, resp);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            req.setAttribute("error", "Account already exists or a database error occurred.");
            doGet(req, resp);
        }
    }
}